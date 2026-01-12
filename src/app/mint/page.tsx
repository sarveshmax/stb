"use client";

import React, { useEffect, useState } from "react";

import BottomBar from "@/components/BottomBar";
import FAQCreator from "@/components/FAQCreator";
import Footer from "@/components/Footer";
import MintLinkWithCopy from "@/components/MintLinkWithCopy";
import SideBar from "@/components/SideBar";
import ToastContainer from "@/components/ToastContainer";
import TopBar from "@/components/TopBar";

import { explorerURL, showBottomBar, tokenCreatorFeeWallet, tokenMintFee } from "@/constants";
import { withTimeout } from "@/utils/ConnectionHelpers";
import { getAnyTokenMetadata } from "@/utils/getMetadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import {
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  MintLayout,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

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

interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  logo: string | null;
  supply: string;
  decimals: number;
  authority?: boolean;
  programId: string;
}

export default function MintPage() {
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;
  const { connection } = useConnection();

  const { toasts, push } = useToasts();

  const [open, setOpen] = useState(false);

  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [mintAmount, setMintAmount] = useState<{ [key: string]: string }>({});
  const [txStatus, setTxStatus] = useState<{ [key: string]: string }>({});
  const [detecting, setDetecting] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [status, setStatus] = useState("");

  const [manualMint, setManualMint] = useState("");

  async function handleManualAdd() {
    if (!manualMint) return push("error", "Enter a mint address");

    if (tokens.some((t) => t.mint.toLowerCase() === manualMint.trim().toLowerCase()))
      return push("error", "Token Already Added");

    try {
      push("info", "Adding Token...");

      const mintPK = new PublicKey(manualMint.trim());
      const mintAcc = await connection.getAccountInfo(mintPK);

      if (!mintAcc) return push("error", "Invalid mint address");

      // Ensure this is a token mint
      const isSPL =
        mintAcc.owner.equals(TOKEN_PROGRAM_ID) || mintAcc.owner.equals(TOKEN_2022_PROGRAM_ID);

      if (!isSPL) return push("error", "Address is Not a Token Mint");

      const mintData = MintLayout.decode(mintAcc.data);
      const decimals = mintData.decimals;

      // SAFER supply handling
      const supply = BigInt(mintData.supply.toString());
      const uiSupply = Number(supply) / 10 ** decimals;

      // ----- Authority check (non-blocking) -----
      let hasAuthority = false;

      if (mintData.mintAuthorityOption === 1 && publicKey) {
        const mintAuth = new PublicKey(mintData.mintAuthority);
        hasAuthority = mintAuth.equals(publicKey);
      }

      const metadata = await withTimeout(
        getAnyTokenMetadata(connection, mintPK.toBase58(), mintAcc.owner),
        5 * 1000, //5 Second Timeout
        { name: "Unknown", symbol: "UNK", image: "/unknowntoken.png" },
      );

      setTokens((p) => [
        ...p,
        {
          mint: mintPK.toBase58(),
          name: metadata.name ?? "Unknown Token",
          symbol: metadata.symbol ?? "UNKNOWN",
          logo: metadata.image ?? null,
          supply: uiSupply.toLocaleString(),
          decimals,
          authority: hasAuthority,
          programId: mintAcc.owner.toBase58(),
        },
      ]);

      push("success", "Token Added");
      setManualMint("");
      setStatus("");
    } catch (err) {
      push("error", "Invalid Token");
      console.error(err);
    }
  }

  async function detectMintAuthorityTokens() {
    if (!publicKey) return push("error", "Connect Wallet");

    setDetecting(true);
    setProgressText("Fetching All Tokens in Wallet…");
    setProgressPercent(10);
    setTokens([]);

    try {
      const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      setProgressPercent(30);
      setProgressText("Filtering Tokens with Mint Authority");

      const mintList: TokenInfo[] = [];

      for (const item of accounts.value) {
        const mintAddr = item.account.data.parsed.info.mint;
        const mintPK = new PublicKey(mintAddr);

        const mintAcc = await connection.getAccountInfo(mintPK);
        if (!mintAcc) continue;

        const mintData = MintLayout.decode(mintAcc.data);

        if (mintData.mintAuthorityOption === 0) continue;

        const mintAuthority = new PublicKey(mintData.mintAuthority);

        if (!mintAuthority.equals(publicKey)) continue;

        const decimals = mintData.decimals;
        const supply = Number(mintData.supply) / 10 ** decimals;

        const metadata = await getAnyTokenMetadata(connection, mintPK.toBase58(), TOKEN_PROGRAM_ID);

        const programId = TOKEN_PROGRAM_ID.toBase58();

        mintList.push({
          mint: mintAddr,
          name: metadata.name,
          symbol: metadata.symbol,
          logo: metadata.image,
          supply: supply.toLocaleString(),
          decimals,
          programId,
        });
      }

      setProgressPercent(70);
      setProgressText("Loading Metadata…");

      await new Promise((r) => setTimeout(r, 300));

      setTokens(mintList);
      setProgressPercent(100);
      setProgressText("Done");

      setTimeout(() => setDetecting(false), 400);
    } catch (err) {
      console.error(err);
      push("error", "Failed to read wallet tokens");
      setDetecting(false);
    }
  }

  async function mintToken(t: TokenInfo) {
    if (!publicKey) return push("error", "Wallet Not Connected");

    const amount = mintAmount[t.mint];
    if (!amount) return push("error", "Enter Amount to Mint");

    setTxStatus((p) => ({ ...p, [t.mint]: "minting" }));

    try {
      const mintPK = new PublicKey(t.mint);
      const mintRaw = BigInt(Number(amount) * 10 ** t.decimals);

      const ata = await getAssociatedTokenAddress(mintPK, publicKey);
      const programId = new PublicKey(t.programId);

      const ixList: any[] = [];

      const ataAcc = await connection.getAccountInfo(ata);
      if (!ataAcc) {
        ixList.push(
          createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, mintPK, programId),
        );
      }

      ixList.push(createMintToInstruction(mintPK, ata, publicKey, mintRaw, [], programId));

      // Fee transfer
      ixList.push(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: tokenCreatorFeeWallet,
          lamports: Math.floor(tokenMintFee * LAMPORTS_PER_SOL),
        }),
      );

      const tx = new Transaction().add(...ixList);
      const signature = await sendTransaction(tx, connection);

      push("success", `Submitted Tx to Mint ${amount} ${t.symbol}.`);
      setStatus(
        `Tx Hash: <a href="${explorerURL}/tx/${signature}" target="_blank" class="no-underline hover:underline text-inherit">${signature}</a>`,
      );
    } catch (err) {
      push("error", "Mint failed");
      console.error(err);
    }

    setTxStatus((p) => ({ ...p, [t.mint]: "idle" }));
  }

  //AUTO-LOAD TOKENS FROM WALLET ON LOADING WEBPAGE & CHANGING WALLET
  useEffect(() => {
    if (publicKey) {
      detectMintAuthorityTokens();
    }
  }, [publicKey]);

  return (
    <div
      className="
    min-h-screen
    pb-[var(--mobile-bottom-bar-height)]
  "
    >
      <TopBar account={publicKey?.toBase58()} open={open} setOpen={setOpen} />
      {showBottomBar && <BottomBar open={open} />}
      <SideBar open={open} setOpen={setOpen} />

      <div className="min-h-screen flex flex-col bg-[#0f0f10] text-white md:ml-64 font-inter">
        <ToastContainer toasts={toasts} />

        <div className="flex-grow p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Wallet + Controls */}
            <div className="bg-[#1c1c1e] rounded-xl p-4 mb-6 border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
              <div className="flex justify-between items-center gap-3">
                <div className="mb-1">
                  <div className="text-lg font-semibold tracking-wide text-white">Token Minter</div>
                  <div className="text-xs text-gray-400">
                    Mint Additional Tokens For Mints You Currently Control
                  </div>
                </div>

                <button
                  onClick={detectMintAuthorityTokens}
                  className={`px-4 py-2 rounded-md font-mono text-sm ${
                    detecting ? "bg-[#3a2f56] text-gray-300" : "bg-[#8b5cf6] hover:bg-[#7c4ee8]"
                  }`}
                >
                  {detecting ? "Fetching..." : "Auto-Detect"}
                </button>
              </div>

              {/* Progress Bar */}
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

            {/* Manual Add Token */}
            <div className="bg-[#1c1c1e] rounded-xl p-4 mb-6 border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
              <div className="flex gap-3 items-center">
                <input
                  placeholder="Manually Add Token (Paste SPL Token Address)"
                  value={manualMint}
                  onChange={(e) => setManualMint(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-[#141416] border border-gray-700 text-sm"
                />
                <button
                  onClick={handleManualAdd}
                  className="px-4 py-2 rounded-md bg-[#8b5cf6] hover:bg-[#7c4ee8] text-sm font-mono"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Token Grid */}
            {detecting ? (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#1c1c1e] rounded-xl p-4 border border-gray-800 animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                  >
                    <div className="w-12 h-12 bg-gray-700 rounded-full mb-4" />
                    <div className="h-4 w-20 bg-gray-700 rounded mb-2" />
                    <div className="h-3 w-32 bg-gray-700 rounded mb-2" />
                    <div className="h-2 w-24 bg-gray-700 rounded mb-4" />
                    <div className="h-10 bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
            ) : tokens.length === 0 ? (
              <div className="text-center opacity-60 text-gray-300 font-inter">
                Click Auto-Detect to load tokens with Mint Authority.
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {tokens.map((t) => {
                  const status = txStatus[t.mint] || "idle";
                  const disabled = status === "minting";

                  return (
                    <div
                      key={t.mint}
                      className="bg-[#1c1c1e] rounded-xl p-4 border border-gray-800 hover:bg-[#232325] transition-all hover:scale-[1.02] shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                    >
                      <div className="flex gap-4 items-center mb-4">
                        <img
                          src={t.logo || "/unknowntoken.png"}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-700"
                          onError={(e) => {
                            e.currentTarget.onerror = null; // prevent infinite loop
                            e.currentTarget.src = "/unknowntoken.png";
                          }}
                        />

                        <div>
                          <div className="text-lg font-semibold">{t.symbol}</div>
                          <div className="text-xs text-gray-400">{t.name}</div>

                          <MintLinkWithCopy mint={t.mint} />

                          <div className="mt-2 inline-flex flex-col px-2 py-1 rounded-md bg-gray-800/60 border border-gray-700">
                            <span className="text-[10px] tracking-wide text-gray-400">
                              Total Supply:
                            </span>
                            <span className="text-sm font-semibold text-gray-200 leading-tight">
                              {t.supply}
                            </span>
                          </div>
                        </div>
                      </div>
                      {t.authority === false && (
                        <div className="mt-2 flex items-start gap-2 rounded-md bg-yellow-900/20 border border-yellow-700/40 px-2 py-1 mb-2">
                          <span className="text-yellow-400 text-xs font-semibold">⚠️</span>
                          <span className="text-[11px] text-yellow-300 leading-snug">
                            You may not have mint authority for this token. Minting may fail.
                          </span>
                        </div>
                      )}

                      <input
                        value={mintAmount[t.mint] || ""}
                        onChange={(e) =>
                          setMintAmount((p) => ({
                            ...p,
                            [t.mint]: e.target.value,
                          }))
                        }
                        placeholder="Amount to mint"
                        className="w-full px-3 py-2 mb-2 rounded bg-[#141416] border border-gray-700 text-sm focus:border-[#8b5cf6]"
                        disabled={disabled}
                      />

                      <button
                        onClick={() => mintToken(t)}
                        disabled={disabled}
                        className={`w-full py-2 rounded text-white font-semibold ${
                          disabled ? "bg-[#3a2f56]" : "bg-[#8b5cf6] hover:bg-[#7c4ee8]"
                        }`}
                      >
                        {status === "minting" ? "Minting..." : "Mint"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              className="mt-6 text-sm text-gray-400 font-mono"
              dangerouslySetInnerHTML={{ __html: status }}
            />
          </div>

          <FAQCreator />
        </div>

        <Footer />
      </div>
    </div>
  );
}
