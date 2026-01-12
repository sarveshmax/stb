"use client";

import React, { useEffect, useState } from "react";

import BottomBar from "@/components/BottomBar";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import PhantomPartnership from "@/components/phantomPartnership";
import SideBar from "@/components/SideBar";
import ToastContainer from "@/components/ToastContainer";
import TopBar from "@/components/TopBar";

import { explorerURL, showBottomBar } from "@/constants";
import { formatRawAmount } from "@/utils/formatRawAmount";
import { getAnyTokenMetadata } from "@/utils/getMetadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, getMint, unpackAccount } from "@solana/spl-token";

/* ------------------------------------
   Toast hook (same as your original)
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
export default function FrozenPage() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const { toasts, push } = useToasts(4000);

  const [open, setOpen] = useState(false); // sidebar
  const [tokens, setTokens] = useState<any[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [txStatus, setTxStatus] = useState<{
    [mint: string]: "idle" | "burning" | "done" | "error";
  }>({});
  const [status, setStatus] = useState("");
  const [vacantAccountText, setVacantAccountText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState("");

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

          //ONLY LOAD FROZEN ACCOUNTS
          if (!unpacked.isFrozen) continue;

          const mint = mintPk.toBase58();
          if (seen.has(mint)) continue;
          seen.add(mint);

          let decimals = 0;
          try {
            const mintAcc = await getMint(connection, mintPk, "confirmed", programId);
            decimals = mintAcc.decimals;
          } catch {}

          const realBalanceString = formatRawAmount(amount, decimals);

          const metadata = await getAnyTokenMetadata(connection, mint, programId);

          if (decimals == 0 && amount == 1n) {
            metadata.name = "[NFT] " + metadata.name;
          }

          detected.push({
            mint,
            programId,
            decimals,
            rawAmount: amount,
            realBalance: realBalanceString,
            name: metadata.name ?? "Unknown Token",
            symbol: metadata.symbol ?? "UNK",
            logo: metadata.image ?? "/unknowntoken.png",
          });
        } catch {}
      }

      setTokens(detected);
      push("success", `Detected ${detected.length} Tokens`);

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
    <div
      className="
    min-h-screen
    pb-[var(--mobile-bottom-bar-height)]
  "
    >
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
                    Check Frozen Tokens
                  </div>

                  {!publicKey ? (
                    <span className="opacity-70 font-mono">Not Connected</span>
                  ) : (
                    <a
                      href={`${explorerURL}/account/${publicKey}`}
                      target="_blank"
                      className="hover:text-[#b49bff] font-mono break-all"
                    >
                      Frozen Tokens Cannot be Sold, Transferred or Burnt
                    </a>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={autoDetectTokens}
                    className={`
                    px-4 py-2 rounded-md font-mono text-sm
                    ${detecting ? "bg-[#3a2f56] text-gray-300" : "bg-[#8b5cf6] hover:bg-[#7c4ee8]"}
                  `}
                  >
                    {detecting ? "Fetching..." : "Refresh"}
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
                    : "Use Refresh Above. If no tokens are detected, you don't hold any Frozen Tokens."}
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                  {tokens.map((t) => {
                    const status = txStatus[t.mint] || "idle";
                    const disabled = status === "burning";

                    return (
                      <div
                        key={t.mint}
                        className="bg-[#1c1c1e] rounded-xl p-4 
                                 border border-gray-800 
                                 hover:bg-[#232325] transition-all 
                                 hover:scale-[1.02] 
                                 shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                      >
                        <div className="flex gap-4 items-center mb-4">
                          {t.logo ? (
                            <img
                              src={t.logo}
                              className="w-12 h-12 rounded-full object-cover border border-gray-700 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                              <span className="text-sm opacity-70">{t.symbol[0]}</span>
                            </div>
                          )}

                          <div>
                            <div className="text-lg text-gray-200 font-semibold">{t.symbol}</div>
                            <div className="text-xs text-gray-400">{t.name}</div>

                            <a
                              href={`${explorerURL}/token/${t.mint}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#9d86ff] hover:text-[#b49bff] break-all"
                            >
                              {t.mint.slice(0, 7)}...{t.mint.slice(-7)}
                            </a>

                            <div className="mt-1 text-sm text-gray-300">
                              {t.realBalance} {t.symbol}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              className="mt-6 text-sm text-gray-400 font-mono"
              dangerouslySetInnerHTML={{ __html: status }}
            />
          </div>

          <div className="flex justify-center pt-5">
            <PhantomPartnership title="Check Frozen Token Accounts" />
          </div>
          <FAQ />
        </div>

        <Footer />
      </div>
    </div>
  );
}
