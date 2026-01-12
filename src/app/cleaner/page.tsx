"use client";

import React, { useEffect, useState } from "react";

import BottomBar from "@/components/BottomBar";
import Faq from "@/components/FAQ";
import SideBar from "@/components/SideBar";
import ToastContainer from "@/components/ToastContainer";
import TokenSection from "@/components/TokenSection";
import TopBar from "@/components/TopBar";
import PhantomPartnership from "@/components/phantomPartnership";

import { waitForConfirmation, withTimeout } from "@/utils/ConnectionHelpers";
import { toRawAmount } from "@/utils/NumberHelpers";
import { formatRawAmount } from "@/utils/formatRawAmount";
import { getAnyTokenMetadata } from "@/utils/getMetadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnimatePresence } from "framer-motion";
import { ExternalLink, Loader2, RefreshCcw, SearchX } from "lucide-react";

import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import {
  createBurnCheckedInstruction,
  createCloseAccountInstruction,
  createHarvestWithheldTokensToMintInstruction,
  ExtensionType,
  getExtensionData,
  getExtensionTypes,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TransferFeeAmountLayout,
  unpackAccount,
} from "@solana/spl-token";

import {
  burnFeeWallet,
  cleanerBurnFee,
  cleanerBurnFee2022,
  explorerURL,
  showBottomBar,
} from "@/constants";

import {
  IGNORE_IN_CLEANER,
  STABLECOINS_CA,
  TOKENS_TO_SHOW_WHEN_CLEANING,
} from "@/constants/valuableTokens";

/* ------------------------------
   Toast Hook
-------------------------------*/
type Toast = { id: number; type: "success" | "error" | "info"; text: string };
function useToasts(ttl = 4000) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = React.useRef(1);

  function push(type: Toast["type"], text: string) {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, ttl);
  }

  return { toasts, push };
}

/* ------------------------------
   MAIN CLEANER PAGE
-------------------------------*/
export default function CleanerPage() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const { toasts, push } = useToasts();

  const [open, setOpen] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [txStatus, setTxStatus] = useState<"idle" | "burning">("idle");
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState("");

  const [activeTab, setActiveTab] = useState<"vacant" | "balance" | "nfts">("vacant");

  const [nftTokens, setNftTokens] = useState<any[]>([]);
  const [vacantTokens, setVacantTokens] = useState<any[]>([]);
  const [tokenWithBalance, setTokenWithBalance] = useState<any[]>([]);

  // Tokens visible in the current tab
  const currentList =
    activeTab === "vacant" ? vacantTokens : activeTab === "balance" ? tokenWithBalance : nftTokens;

  /* ------------------------------
     Auto Detect Tokens
  -------------------------------*/
  async function detectTokens(refreshingAfterBurn = false) {
    if (!publicKey) return push("error", "Wallet Not Connected");
    setLoadingTokens(true);
    clearAllLoadedTokens();

    setProgressPercent(10);
    if (!refreshingAfterBurn) setProgressText("Fetching token accounts...");

    try {
      const [legacy, tok22] = await Promise.all([
        connection.getTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        }),
        connection.getTokenAccountsByOwner(publicKey, {
          programId: TOKEN_2022_PROGRAM_ID,
        }),
      ]);

      setProgressPercent(30);
      setProgressText("Processing accounts...");

      const raw = [
        ...legacy.value.map((a) => ({ ...a, programId: TOKEN_PROGRAM_ID })),
        ...tok22.value.map((a) => ({ ...a, programId: TOKEN_2022_PROGRAM_ID })),
      ];

      const list: any[] = [];

      let index = 0;
      const total = raw.length;

      for (const { pubkey, account, programId } of raw) {
        index++;

        // update progress for each token
        const progress = total > 0 ? 30 + Math.floor((index / total) * 60) : 90;
        setProgressPercent(progress);
        setProgressText(`Fetching Tokens (${index}/${total})... `);

        try {
          const acc = unpackAccount(pubkey, account, programId);
          const mintInfo = await getMint(connection, acc.mint, "confirmed", programId);

          let hasAccountWithheld = false;

          if (programId === TOKEN_2022_PROGRAM_ID) {
            const tfAmountData = getExtensionData(ExtensionType.TransferFeeAmount, acc.tlvData);

            if (tfAmountData) {
              const decoded = TransferFeeAmountLayout.decode(tfAmountData);
              hasAccountWithheld = decoded.withheldAmount > 0n;
            }
          }
          const [mintPk, amount, decimals] = [acc.mint, acc.amount, mintInfo.decimals ?? 0];
          const realBal = formatRawAmount(amount, decimals);

          // SKIPPING FROZEN ACCS | TRANSFER-HOOK TOKENS | STABLECOIN BAL > $10
          if (acc.isFrozen) continue;
          if (!TOKENS_TO_SHOW_WHEN_CLEANING.includes(mintPk.toBase58())) {
            const BLOCK_CLOSE_EXTENSIONS = new Set<ExtensionType>([
              ExtensionType.TransferHook,
              ExtensionType.NonTransferable,
            ]);
            const extensions = getExtensionTypes(mintInfo.tlvData);
            if (extensions.some((e) => BLOCK_CLOSE_EXTENSIONS.has(e))) continue;
          }
          if (
            STABLECOINS_CA.includes(mintPk.toBase58()) &&
            acc.amount > toRawAmount("10", decimals)
          )
            continue;

          // SKIP LOADING VACANT ACCOUNT DETAILS
          if (total > 0 && amount === 0n) {
            list.push({
              mint: mintPk.toBase58(),
              ata: pubkey,
              programId,
              amount,
              decimals,
              balance: "0",
              name: "Vacant Account",
              symbol: "Burn to Claim 0.002 SOL",
              logo: "/vacant2.png",
              haswithheld: hasAccountWithheld,
            });
            continue;
          }

          //Auto-timeout getMetadata after 5s
          const metadata = await withTimeout(
            getAnyTokenMetadata(
              connection,
              mintPk.toBase58(),
              programId,
              mintInfo.mintAuthority,
              mintInfo.freezeAuthority,
              decimals === 0 && amount === 1n, //isNFT?
            ),
            5 * 1000, //5 Second Timeout
            { name: "Unknown", symbol: "UNK", image: "/unknowntoken.png" },
          );

          //SKIP LOADING LP TOKEN WITH BALANCE
          if (IGNORE_IN_CLEANER.includes(metadata.symbol)) continue;

          list.push({
            mint: mintPk.toBase58(),
            ata: pubkey,
            programId,
            amount,
            decimals,
            balance: realBal,
            name: metadata.name ?? "Unknown Token",
            symbol: metadata.symbol ?? "UNK",
            logo: metadata.image ?? "/unknowntoken.png",
            haswithheld: hasAccountWithheld,
          });
        } catch (e) {
          console.warn("skip", e);
        }
      }

      const nftList = list.filter((t) => t.amount == 1n && Number(t.decimals) == 0);
      const normalTokens = list.filter((t) => !(t.amount == 1n && Number(t.decimals) == 0));

      const withBal = normalTokens.filter((t) => Number(t.balance) > 0);
      const vacant = normalTokens.filter((t) => Number(t.balance) === 0);

      setNftTokens(nftList);
      setTokenWithBalance(withBal);
      setVacantTokens(vacant);
      setTokens([...vacant, ...withBal, ...nftList]);

      push("success", "Tokens Loaded");

      // sendNotification("STB", `Cleaner used for ${raw.length} tokens`, -1);

      if (vacant.length === 0 && withBal.length > 0) {
        setActiveTab("balance");
      } else {
        setActiveTab("vacant");
      }

      setProgressPercent(100);
      setProgressText("Done");
    } catch (err) {
      console.error(err);
      push("error", "Failed to Fetch Tokens");
    } finally {
      setTimeout(() => {
        setLoadingTokens(false);
        setProgressPercent(0);
        setProgressText("");
      }, 400);
    }
  }

  useEffect(() => {
    if (publicKey) detectTokens();
  }, [publicKey]);

  useEffect(() => {
    document.documentElement.style.setProperty("--cleaner-bottom-bar-height", "56px");

    return () => {
      document.documentElement.style.setProperty("--cleaner-bottom-bar-height", "0px");
    };
  }, []);

  /* ------------------------------
     Multi-select handlers
  -------------------------------*/
  function toggleSelect(mint: string) {
    setSelected((prev) => (prev.includes(mint) ? prev.filter((x) => x !== mint) : [...prev, mint]));
  }

  function selectAll() {
    setSelected(tokens.map((t) => t.mint));
  }

  function clearAll() {
    setSelected([]);
  }

  function clearAllLoadedTokens() {
    setSelected([]);
    setTokens([]);
    setVacantTokens([]);
    setTokenWithBalance([]);
    setNftTokens([]);
  }

  /* ------------------------------
     Burn Multiple Tokens
  -------------------------------*/
  async function burnSelected() {
    if (!publicKey) return push("error", "Wallet Not Connected");
    if (selected.length === 0) return push("error", "No Tokens Selected");

    setTxStatus("burning");

    const BATCH_SIZE = 10;

    // Split selected into chunks of BATCH_SIZE
    const batches: string[][] = [];
    for (let i = 0; i < selected.length; i += BATCH_SIZE) {
      batches.push(selected.slice(i, i + BATCH_SIZE));
    }

    try {
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const tx = new Transaction();

        // Build instructions for this batch
        for (const mintAddr of batch) {
          const t = tokens.find((x) => x.mint === mintAddr);
          if (!t) continue;

          const mint = new PublicKey(t.mint);
          const ata = new PublicKey(t.ata);

          const rawAmount = toRawAmount(t.balance, t.decimals);

          //1- HARVEST WITHHELD FEES FOR TRANSFERFEE TOKENS
          if (t.haswithheld) {
            tx.add(createHarvestWithheldTokensToMintInstruction(mint, [ata], t.programId));
          }

          //  2- BURN TOKENS WITH BALANCE>0
          if (rawAmount > 0n) {
            tx.add(
              createBurnCheckedInstruction(
                ata,
                mint,
                publicKey,
                rawAmount,
                t.decimals,
                [],
                t.programId,
              ),
            );
          }

          //3- CLOSE TOKEN ACCOUNT AND REDEEM
          tx.add(createCloseAccountInstruction(ata, publicKey, publicKey, [], t.programId));
        }

        // Calculate total fee for THIS batch only
        const batchFeeSol = batch.reduce((sum, mint) => {
          const t = tokens.find((a) => a.mint === mint);
          return (
            sum + (t?.programId === TOKEN_2022_PROGRAM_ID ? cleanerBurnFee2022 : cleanerBurnFee)
          );
        }, 0);

        //TODO: if trasferfee then fee can be 0.0001576

        //4- ADD FEE TO BURN
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: burnFeeWallet,
            lamports: Math.floor(batchFeeSol * LAMPORTS_PER_SOL),
          }),
        );

        // Send the batch transaction
        push("info", `Approve Burning: Batch ${i + 1} of ${batches.length}`);
        const sig = await sendTransaction(tx, connection);
        await waitForConfirmation(connection, sig, "confirmed");

        push("success", `Batch ${i + 1} of ${batches.length} Completed`);
      }

      push("success", "All Tokens Successfully Burned. Refreshing Token List.");
      setSelected([]);
      detectTokens(true);
    } catch (err) {
      console.error(err);
      push("error", "Burn Failed");
    }

    setTxStatus("idle");
  }

  /* ------------------------------
     UI
  -------------------------------*/
  return (
    <div
      className="
    min-h-screen
    pb-[calc(var(--mobile-bottom-bar-height)+var(--cleaner-bottom-bar-height))]
  "
    >
      <TopBar account={publicKey?.toBase58()} open={open} setOpen={setOpen} />
      {showBottomBar && <BottomBar open={open} />}
      <SideBar open={open} setOpen={setOpen} />

      <div className="min-h-screen flex flex-col bg-[#0f0f10] text-white md:ml-64 pt-0 font-inter pb-16">
        <ToastContainer
          toasts={toasts}
          offsetBottom={typeof window !== "undefined" && window.innerWidth < 640 ? "9rem" : "6rem"}
        />

        <div className="flex-grow p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Wallet + Controls */}
            <div
              className="bg-[#1c1c1e] rounded-xl p-4 mb-6
            border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs text-gray-300 ">
                  <div className="text-lg font-semibold tracking-wide text-white">
                    Close Token Accounts & Claim SOL
                  </div>

                  {!publicKey ? (
                    <span className="opacity-70 font-mono">Not Connected</span>
                  ) : (
                    <a
                      href={`${explorerURL}/account/${publicKey}`}
                      target="_blank"
                      className="group flex items-center gap-1 hover:text-[#b49bff] font-mono break-all"
                    >
                      {publicKey.toBase58()}
                      <ExternalLink
                        size={12}
                        className="opacity-0 group-hover:opacity-70 transition"
                      />
                    </a>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => detectTokens()}
                    className={`
                      group flex items-center gap-2
                      px-4 py-2 rounded-md font-mono text-sm
                      transition
                      ${
                        loadingTokens
                          ? "bg-[#3a2f56] text-gray-300 cursor-not-allowed"
                          : "bg-[#8b5cf6] hover:bg-[#7c4ee8]"
                      }
                    `}
                    disabled={loadingTokens}
                  >
                    {loadingTokens ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <RefreshCcw size={14} />
                        Refresh
                      </>
                    )}
                  </button>
                </div>
              </div>

              {loadingTokens && (
                <div className="mt-3 text-sm text-[#DDD7FE] font-mono">
                  <div>{progressText}</div>
                  <div className="w-full bg-white/10 h-2 rounded mt-2 overflow-hidden">
                    <div
                      className="h-2 bg-[#6E54FF] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex gap-3 mb-6">
              {/* Vacant Accounts */}
              <button
                onClick={() => setActiveTab("vacant")}
                className={`
      px-4 py-2 rounded-lg text-sm font-semibold flex items-center
      ${activeTab === "vacant" ? "bg-[#8b5cf6] text-white" : "bg-[#2a2a2c] text-gray-300"}
    `}
              >
                Vacant Accounts
                {!loadingTokens && vacantTokens.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/10 text-gray-200 text-xs rounded-full">
                    {vacantTokens.length}
                  </span>
                )}
              </button>

              {/* Tokens With Balance */}
              <button
                onClick={() => setActiveTab("balance")}
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold flex items-center
                  ${
                    activeTab === "balance"
                      ? "bg-[#8b5cf6] text-white"
                      : "bg-[#2a2a2c] text-gray-300"
                  }
                `}
              >
                Tokens With Balance
                {!loadingTokens && tokenWithBalance.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/10 text-gray-200 text-xs rounded-full">
                    {tokenWithBalance.length}
                  </span>
                )}
              </button>

              {/* NFTs */}
              <button
                onClick={() => setActiveTab("nfts")}
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold flex items-center
                  ${activeTab === "nfts" ? "bg-[#8b5cf6] text-white" : "bg-[#2a2a2c] text-gray-300"}
                `}
              >
                NFTs
                {!loadingTokens && nftTokens.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/10 text-gray-200 text-xs rounded-full">
                    {nftTokens.length}
                  </span>
                )}
              </button>
            </div>

            {/* Token List */}
            <div className="mt-6">
              {/* 🔥 1. Show skeleton while loading */}
              {loadingTokens && tokens.length === 0 && (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#1c1c1e] rounded-xl p-4 border border-gray-800 shadow animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-gray-700 rounded" />
                          <div className="h-3 w-20 bg-gray-700 rounded" />
                          <div className="h-3 w-16 bg-gray-700 rounded" />
                        </div>
                        <div className="hidden sm:block h-3 w-24 bg-gray-700 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 🔥 2. Show "no tokens" AFTER loading */}
              {!loadingTokens && tokens.length === 0 && (
                <div className="flex flex-col items-center gap-2 opacity-60 text-gray-300 font-inter">
                  {publicKey ? (
                    <>
                      <SearchX size={28} />
                      <span>No Tokens Found</span>
                    </>
                  ) : (
                    <>
                      <span>Please Connect Your Wallet - Phantom Recommended.</span>
                    </>
                  )}
                </div>
              )}

              {/* 🔥 3. Show actual content when tokens exist */}
              {!loadingTokens && tokens.length > 0 && (
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* ACTIVE TAB CONTENT */}
                    {activeTab === "vacant" && (
                      <TokenSection
                        key="vacant"
                        title="ZERO-BALANCE TOKEN ACCOUNTS"
                        tokenList={vacantTokens}
                        selected={selected}
                        setSelected={setSelected}
                        toggleSelect={toggleSelect}
                        isVacant
                      />
                    )}

                    {activeTab === "balance" && (
                      <TokenSection
                        key="balance"
                        title="TOKENS WITH BALANCE"
                        tokenList={tokenWithBalance}
                        selected={selected}
                        setSelected={setSelected}
                        toggleSelect={toggleSelect}
                      />
                    )}

                    {activeTab === "nfts" && (
                      <TokenSection
                        key="nfts"
                        title="NFTs"
                        tokenList={nftTokens}
                        selected={selected}
                        setSelected={setSelected}
                        toggleSelect={toggleSelect}
                        isNFT
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center pt-10">
            <PhantomPartnership title="Burn Tokens & Claim SOL" />
          </div>

          <Faq />
        </div>

        {/* Sticky Bottom Bar - FIXED mobile-friendly */}
        {tokens.length >= 0 && (
          <div
            className="
              fixed
              bottom-[calc(var(--mobile-bottom-bar-height)+12px)]
              left-3 right-3
              md:left-[calc(16rem+12px)] md:right-3

              /* MOBILE (default) - darker, denser */
              bg-[#121214]/85
              border border-white/5
              shadow-[inset_0_1px_0_rgba(255,255,255,0.03),_0_14px_28px_rgba(0,0,0,0.7),_0_4px_10px_rgba(0,0,0,0.5)]
              ring-1 ring-white/17

              /* DESKTOP - lighter glass */
              md:bg-[#18181b]/70
              md:border-white/10
              md:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_12px_25px_rgba(0,0,0,0.6),_0_2px_8px_rgba(0,0,0,0.4)]
              md:ring-white/5

              backdrop-blur-2xl backdrop-saturate-150
              rounded-2xl

              p-3 sm:p-4
              flex flex-col sm:flex-row
              sm:justify-between sm:items-center
              gap-3

              z-[40]
            "
          >
            <div className="flex items-center gap-4 bg-[#1a1a1c] px-4 py-2 rounded-xl border border-white/10">
              <span className="text-lg font-semibold text-white">{selected.length} Selected</span>

              <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                +{(selected.length * 0.002).toFixed(3)} SOL
              </span>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={clearAll}
                disabled={selected.length === 0}
                className={`
                px-4 py-2 rounded font-semibold text-white text-s
                ${
                  selected.length === 0
                    ? "bg-[#2a2a2c] opacity-50 cursor-not-allowed"
                    : "bg-[#3d3d40] hover:bg-[#4c4c50]"
                }
              `}
              >
                Clear All
              </button>

              <button
                onClick={burnSelected}
                disabled={txStatus === "burning" || selected.length === 0}
                className={`
    px-5 py-2 rounded font-semibold text-white text-s
    transition
    ${
      txStatus === "burning"
        ? "bg-[#3a2f56] cursor-not-allowed"
        : selected.length === 0
          ? "bg-[#2a2a2c] opacity-60 cursor-not-allowed"
          : "bg-[#8b5cf6] hover:bg-red-400"
    }
  `}
              >
                {txStatus === "burning"
                  ? "Burning..."
                  : selected.length === 0
                    ? "Burn Tokens"
                    : selected.length === 1
                      ? "Burn 1 Token"
                      : `Burn ${selected.length} Tokens`}
              </button>
            </div>
          </div>
        )}

        {/* <Footer /> */}
      </div>
    </div>
  );
}
