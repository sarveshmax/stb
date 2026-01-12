"use client";

import React, { useEffect, useState } from "react";

import BottomBar from "@/components/BottomBar";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import MintLinkWithCopy from "@/components/MintLinkWithCopy";
import PhantomPartnership from "@/components/phantomPartnership";
import SideBar from "@/components/SideBar";
import ToastContainer from "@/components/ToastContainer";
import TopBar from "@/components/TopBar";

import { STABLECOINS_CA } from "@/constants/valuableTokens";
import { waitForConfirmation, withTimeout } from "@/utils/ConnectionHelpers";
import { formatRawAmount } from "@/utils/formatRawAmount";
import { getAnyTokenMetadata } from "@/utils/getMetadata";
import { formatNumberWithCommas, toRawAmount } from "@/utils/NumberHelpers";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ExternalLink, Flame, Loader2, RefreshCcw } from "lucide-react";

import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import { burnFee, burnFeeToken2022, burnFeeWallet, explorerURL, showBottomBar } from "@/constants";

import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createBurnCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  unpackAccount,
} from "@solana/spl-token";

/* ------------------------------------
   Toast Hook
--------------------------------------*/
type Toast = { id: number; type: "success" | "error" | "info"; text: string };
function useToasts(ttl = 5000) {
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

/* ------------------------------------
   MAIN PAGE
--------------------------------------*/
export default function Page() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { toasts, push } = useToasts(4000);
  const [open, setOpen] = useState(false); // sidebar
  const [tokens, setTokens] = useState<any[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [vacantAccountText, setVacantAccountText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [burnAmount, setBurnAmount] = useState<{ [mint: string]: string }>({});
  const [txHashByMint, setTxHashByMint] = useState<{ [mint: string]: string }>({});
  const [txStatus, setTxStatus] = useState<{
    [mint: string]: "idle" | "burning" | "done" | "error";
  }>({});

  /* ------------------------------------
     Auto Detect Tokens (Solana)
  --------------------------------------*/
  async function autoDetectTokens() {
    if (!publicKey) return push("error", "Wallet Not Connected");

    setDetecting(true);
    setProgressPercent(10);
    setProgressText("Fetching token accounts...");

    try {
      const [legacy, tok22] = await Promise.all([
        connection
          .getTokenAccountsByOwner(publicKey, {
            programId: TOKEN_PROGRAM_ID,
          })
          .catch(() => ({ value: [] })),
        connection
          .getTokenAccountsByOwner(publicKey, {
            programId: TOKEN_2022_PROGRAM_ID,
          })
          .catch(() => ({ value: [] })),
      ]);

      setProgressPercent(30);
      setProgressText("Parsing token accounts...");

      const allAccounts = [
        ...legacy.value.map((a) => ({ ...a, programId: TOKEN_PROGRAM_ID })),
        ...tok22.value.map((a) => ({ ...a, programId: TOKEN_2022_PROGRAM_ID })),
      ];

      const detected: any[] = [];
      const seen = new Set<string>();

      let index = 0;
      let vacantAccountsCount = 0;
      for (const { pubkey, account, programId } of allAccounts) {
        index++;

        // update progress smoothly
        setProgressPercent(30 + Math.floor((index / allAccounts.length) * 60));
        setProgressText(`Fetching Tokens (${index}/${allAccounts.length})...`);

        try {
          const unpacked = unpackAccount(pubkey, account, programId);
          const mintPk = unpacked.mint;
          const amount = unpacked.amount;
          if (amount === 0n) {
            vacantAccountsCount++;
            continue;
          }
          if (unpacked.isFrozen) continue;

          const mint = mintPk.toBase58();
          if (seen.has(mint)) continue;
          seen.add(mint);

          let decimals = 0;
          let mintAuthority: PublicKey | null = null;
          let freezeAuthority: PublicKey | null = null;
          try {
            const mintAcc = await getMint(connection, mintPk, "confirmed", programId);
            decimals = mintAcc.decimals;
            mintAuthority = mintAcc.mintAuthority;
            freezeAuthority = mintAcc.freezeAuthority;
          } catch {}

          const realBalanceString = formatRawAmount(amount, decimals);
          const isNFT = decimals === 0 && amount === 1n;

          const metadata = await withTimeout(
            getAnyTokenMetadata(connection, mint, programId, mintAuthority, freezeAuthority, isNFT),
            5 * 1000, //5 Second Timeout
            { name: "Unknown", symbol: "UNK", image: "/unknowntoken.png" },
          );

          detected.push({
            mint,
            programId,
            decimals,
            rawAmount: amount,
            realBalance: realBalanceString,
            name: metadata.name ?? "Unknown Token",
            symbol: metadata.symbol ?? "UNK",
            logo: metadata.image ?? "/unknowntoken.png",
            isNFT,
          });
        } catch {}
      }

      if (vacantAccountsCount >= 5) {
        const solToClaim = (vacantAccountsCount * 0.002).toFixed(3);
        setVacantAccountText(`
          💡 <strong>Tip:</strong> You currently hold <strong>${vacantAccountsCount}</strong> vacant accounts (zero-balance tokens).<br />
          Use <a href="/cleaner">💵 Cleaner</a> to close these accounts and reclaim 
          <strong>${solToClaim} SOL</strong> in rent fees.
        `);
      } else setVacantAccountText("");

      setTokens(detected);
      push("success", `Detected ${detected.length} Tokens`);

      //CLEAR TEXTBOXES
      setBurnAmount({});
      setTxHashByMint({});
      setTxStatus({});

      setProgressPercent(100);
      setProgressText("Done");
    } catch (err) {
      console.error(err);
      push("error", "Detection Failed");
    } finally {
      setTimeout(() => {
        setDetecting(false);
        setProgressPercent(0);
        setProgressText("");
      }, 500);
    }
  }

  /* ------------------------------------
     Burn Token
  --------------------------------------*/

  async function burnToken(t: any) {
    if (!publicKey) return push("error", "Wallet Not Connected");

    const amountStr = burnAmount[t.mint];
    if (!amountStr) return push("error", "Enter Amount to Burn");

    try {
      setTxStatus((s) => ({ ...s, [t.mint]: "burning" }));

      if (
        //WARNING: BURNING STABLECOIN
        STABLECOINS_CA.includes(t.mint) &&
        toRawAmount(amountStr, t.decimals) > toRawAmount("10", t.decimals)
      )
        push(
          "info",
          "⚠️ This action is NOT recommended. You are burning a stablecoin of high value.",
        );

      const mint = new PublicKey(t.mint);
      const ata = await getAssociatedTokenAddress(mint, publicKey, false, t.programId);

      const senderTokenAddress = await getAssociatedTokenAddress(
        mint,
        publicKey,
        false,
        t.programId,
      );

      var rawAmount = toRawAmount(amountStr, t.decimals);
      const feeToBurn = t.programId.equals(TOKEN_2022_PROGRAM_ID) ? burnFeeToken2022 : burnFee;

      const tx = new Transaction();

      tx.add(
        createBurnCheckedInstruction(
          ata, // token account
          mint, // mint
          publicKey, // owner
          rawAmount,
          t.decimals,
          [], // multisig (not used)
          t.programId,
        ),
      );

      // Fee transfer
      tx.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: burnFeeWallet,
          lamports: Math.floor(feeToBurn * LAMPORTS_PER_SOL),
        }),
      );

      // Always get fresh blockhash before sending
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      // Sign + send
      const signature = await sendTransaction(tx, connection);
      await waitForConfirmation(connection, signature, "confirmed");
      setBurnAmount({});

      push("success", "Burn Complete");
      setTxStatus((s) => ({ ...s, [t.mint]: "done" }));

      setTxHashByMint((p) => ({
        ...p,
        [t.mint]: signature,
      }));

      //Update Balance in UI of Burned Token
      if (rawAmount <= t.rawAmount) {
        setTokens((prev) =>
          prev.map((token) => {
            if (token.mint !== t.mint) return token;

            const newRawAmount = token.rawAmount - rawAmount;
            return {
              ...token,
              rawAmount: newRawAmount,
              realBalance: formatRawAmount(newRawAmount, token.decimals),
            };
          }),
        );
      }
    } catch (err) {
      console.error(err);
      push("error", "Burn Failed");
      setTxStatus((s) => ({ ...s, [t.mint]: "error" }));
    } finally {
      setTimeout(() => {
        setTxStatus((s) => ({ ...s, [t.mint]: "idle" }));
      }, 1200);
    }
  }

  //AUTO-LOAD TOKENS FROM WALLET ON LOADING WEBPAGE & CHANGING WALLET
  useEffect(() => {
    if (publicKey) {
      autoDetectTokens();
    }
  }, [publicKey]);

  /* ------------------------------------
     UI START
  --------------------------------------*/
  return (
    <div className="min-h-screen pb-[var(--mobile-bottom-bar-height)]">
      <TopBar account={publicKey?.toBase58()} open={open} setOpen={setOpen} />
      {showBottomBar && <BottomBar open={open} />}
      <SideBar open={open} setOpen={setOpen} />

      <div className="min-h-screen flex flex-col bg-[#0f0f10] text-white md:ml-64 pt-0 font-inter">
        <ToastContainer toasts={toasts} />

        <div className="flex-grow p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Wallet + Controls */}
            <div
              className="bg-[#1c1c1e] rounded-xl p-4 mb-6 
                          border border-gray-800 
                          shadow-[0_0_15px_rgba(0,0,0,0.4)]"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs text-gray-300 ">
                  <div className="text-lg font-semibold tracking-wide text-white">
                    Burn Solana Tokens & LP
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
                    onClick={autoDetectTokens}
                    className={`
                      flex items-center gap-2
                      px-4 py-2 rounded-md font-mono text-sm
                      transition
                      ${
                        detecting ? "bg-[#3a2f56] text-gray-300" : "bg-[#8b5cf6] hover:bg-[#7c4ee8]"
                      }
                    `}
                  >
                    {detecting ? (
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
              {detecting && (
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

            {/* Vacant Accounts Info */}
            {vacantAccountText && (
              <div className="mb-6 text-sm rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 text-gray-300 shadow-sm backdrop-blur">
                <div
                  dangerouslySetInnerHTML={{ __html: vacantAccountText }}
                  className="leading-relaxed [&_a]:text-purple-300 [&_a]:underline hover:[&_a]:text-purple-200"
                />
              </div>
            )}

            {/* Token Grid */}
            <div>
              {detecting && tokens.length === 0 ? ( //skeleton
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#1c1c1e] rounded-xl p-4 
                               border border-gray-800 
                               animate-pulse 
                               shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                    >
                      <div className="flex gap-4 items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-20 bg-gray-700 rounded"></div>
                          <div className="h-3 w-32 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="h-3 w-28 bg-gray-700 rounded mb-4"></div>
                      <div className="h-10 w-full rounded bg-gray-700 mb-3"></div>
                      <div className="h-8 w-full rounded bg-gray-700"></div>
                    </div>
                  ))}
                </div>
              ) : tokens.length === 0 ? (
                <div className="text-center opacity-60 text-gray-300 font-inter">
                  {!publicKey
                    ? "Please Connect Your Wallet - Phantom Recommended."
                    : "Use Refresh Above. If no tokens are detected, please use the Cleaner."}
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                  {tokens.map((t) => {
                    const status = txStatus[t.mint] || "idle";
                    const disabled = status === "burning";

                    return (
                      <div
                        key={t.mint}
                        className="relative bg-[#1c1c1e] rounded-xl p-4 
                                 border border-gray-800 
                                 hover:bg-[#232325] transition-all 
                                 hover:scale-[1.02] 
                                 shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                      >
                        {t.isNFT && (
                          <div
                            className="
                              absolute top-3 right-3
                              px-2 py-[1px]
                              text-[10px] font-medium
                              rounded-md

                              text-gray-400
                              bg-[#141416]
                              uppercase tracking-wide
                              select-none              
                            "
                          >
                            NFT
                          </div>
                        )}

                        <div className="flex gap-4 items-center mb-4">
                          <img
                            src={t.logo || "/unknowntoken.png"}
                            className={`w-12 h-12  object-cover border border-gray-700 shadow-sm
                                ${t.isNFT ? "rounded-md" : "rounded-full"}
                                `}
                            onError={(e) => {
                              e.currentTarget.onerror = null; // prevent infinite loop
                              e.currentTarget.src = "/unknowntoken.png";
                            }}
                          />

                          <div>
                            <div className="text-lg text-gray-200 font-semibold">{t.symbol}</div>
                            <div className="text-xs text-gray-400">{t.name}</div>

                            <MintLinkWithCopy mint={t.mint} />

                            <div className="mt-1 text-sm text-gray-300">
                              {formatNumberWithCommas(t.realBalance)} {t.symbol}
                            </div>
                          </div>
                        </div>

                        {txHashByMint[t.mint] && (
                          <div className="mb-2 flex items-center gap-2 rounded-md bg-[#161618] px-3 py-1.5 text-[11px]">
                            <Flame size={12} className="text-red-500 shrink-0 opacity-80" />

                            <span className="text-gray-400 font-medium whitespace-nowrap">
                              Burn Tx:
                            </span>

                            <MintLinkWithCopy
                              mint={txHashByMint[t.mint]}
                              type="tx"
                              linkClassName="text-gray-200 hover:text-white truncate font-mono"
                            />
                          </div>
                        )}

                        <input
                          value={burnAmount[t.mint] || ""}
                          onChange={(e) =>
                            setBurnAmount((p) => ({
                              ...p,
                              [t.mint]: e.target.value,
                            }))
                          }
                          placeholder="Amount to burn"
                          className="w-full px-3 py-2 mb-2 rounded bg-[#141416] 
                                   border border-gray-700 text-sm
                                   focus:border-[#8b5cf6] focus:outline-none"
                          disabled={disabled}
                        />

                        <button
                          onClick={() =>
                            setBurnAmount((p) => ({
                              ...p,
                              [t.mint]: String(t.realBalance),
                            }))
                          }
                          className="w-full py-1 mb-2 rounded 
                                   bg-[#2a2a2c] hover:bg-[#3a3a3c] text-sm 
                                   text-gray-200"
                          disabled={disabled}
                        >
                          MAX
                        </button>

                        <button
                          onClick={() => burnToken(t)}
                          className={`
                          w-full py-2 rounded text-white font-semibold
                          ${status === "burning" ? "bg-[#3a2f56]" : "bg-[#8b5cf6] hover:bg-red-400"}
                        `}
                          disabled={disabled}
                        >
                          {status === "burning" ? "Burning..." : "Burn"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* <div
              className="mt-6 text-sm text-gray-400 font-mono"
              dangerouslySetInnerHTML={{ __html: status }}
            /> */}
          </div>

          <div className="flex justify-center pt-5">
            <PhantomPartnership title="Burn Solana SPL, LP & Pumpfun Tokens" />
          </div>
          <FAQ />
        </div>

        <Footer />
      </div>
    </div>
  );
}
