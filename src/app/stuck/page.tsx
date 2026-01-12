"use client";

import React, { useState } from "react";

import BottomBar from "@/components/BottomBar";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import MintLinkWithCopy from "@/components/MintLinkWithCopy";
import SideBar from "@/components/SideBar";
import ToastContainer from "@/components/ToastContainer";
import TopBar from "@/components/TopBar";

import { burnFeeWallet, explorerURL, incineratorBurnFee, showBottomBar } from "@/constants";
import { withTimeout } from "@/utils/ConnectionHelpers";
import { formatNumberWithCommas } from "@/utils/NumberHelpers";
import { getAnyTokenMetadata } from "@/utils/getMetadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createBurnCheckedInstruction,
  getMint,
  unpackAccount,
} from "@solana/spl-token";

/* ---------------------------------------------------
   Toast Hook
-----------------------------------------------------*/
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

/* ---------------------------------------------------
   Constants
-----------------------------------------------------*/
const INCINERATOR = new PublicKey("1nc1nerator11111111111111111111111111111111");

/* ---------------------------------------------------
   Types
-----------------------------------------------------*/
interface StuckToken {
  mint: string;
  symbol: string;
  name: string;
  logo: string | null;
  decimals: number;
  tokenAccount: string;
  balance: number;
  programId: PublicKey;
}

/* ---------------------------------------------------
   Page Component
-----------------------------------------------------*/
export default function StuckPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const { toasts, push } = useToasts();

  const [open, setOpen] = useState(false); // sidebar
  const [manualMint, setManualMint] = useState("");

  const [tokens, setTokens] = useState<StuckToken[]>([]);
  const [burnAmount, setBurnAmount] = useState<{ [mint: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  /* ---------------------------------------------------
     Manual Add Handler
  -----------------------------------------------------*/
  async function handleManualAdd() {
    if (!publicKey) return push("error", "Wallet Not Connected");
    if (!manualMint) return push("error", "Enter a mint address");

    let mintPK: PublicKey;
    try {
      mintPK = new PublicKey(manualMint);
    } catch {
      return push("error", "Invalid mint address");
    }

    push("info", "Fetching Token Details...");
    setStatus("");
    setTokens([]);

    try {
      // 1️⃣ Identify which program the mint belongs to
      const mintInfo = await connection.getAccountInfo(mintPK);

      if (!mintInfo) return push("error", "Mint not found on Solana");

      const owner = mintInfo.owner;

      let programId: PublicKey;
      if (owner.equals(TOKEN_PROGRAM_ID)) {
        programId = TOKEN_PROGRAM_ID;
      } else if (owner.equals(TOKEN_2022_PROGRAM_ID)) {
        programId = TOKEN_2022_PROGRAM_ID;
      } else {
        return push("error", "Unable to Fetch Token Details");
      }

      // 2️⃣ Query ONLY the correct token program
      const res = await connection.getTokenAccountsByOwner(INCINERATOR, {
        mint: mintPK,
        programId,
      });

      if (res.value.length === 0) return push("error", "No stuck tokens found for this mint");

      const { pubkey, account } = res.value[0];

      // 3️⃣ Decode token account
      const unpacked = unpackAccount(pubkey, account, programId);

      if (unpacked.amount === 0n)
        push("info", "NOTE: This Incinerator Token Account is Already Empty");

      // 4️⃣ Fetch decimals
      const mintAcc = await getMint(connection, mintPK, "confirmed", programId);
      const decimals = mintAcc.decimals;

      const realBalance = Number(unpacked.amount) / 10 ** decimals;

      // 5️⃣ Metadata
      const metadata = await withTimeout(
        getAnyTokenMetadata(connection, mintPK.toBase58(), programId, mintAcc.mintAuthority),
        10 * 1000,
        { name: "Unknown", symbol: "UNK", image: null },
      );

      // 6️⃣ Add to UI
      setTokens((prev) => [
        ...prev,
        {
          mint: mintPK.toBase58(),
          symbol: metadata.symbol ?? "UNK",
          name: metadata.name ?? "Unknown Token",
          logo: metadata.image ?? null,
          decimals,
          tokenAccount: pubkey.toBase58(),
          balance: realBalance,
          programId,
        },
      ]);

      push("success", "Token Added");
    } catch (err) {
      console.error(err);
      push("error", "Failed to Fetch Token");
    }
  }

  /* ---------------------------------------------------
     Burn Stuck Token
  -----------------------------------------------------*/
  async function burnToken(t: StuckToken) {
    if (!publicKey) return push("error", "Connect Wallet");

    const amountStr = burnAmount[t.mint];
    if (!amountStr) return push("error", "Enter Amount to Burn");

    const amountNum = Number(amountStr);
    if (isNaN(amountNum) || amountNum < 0) return push("error", "Invalid Amount");

    if (amountNum > t.balance) push("info", "NOTE: Amount Exceeds Stuck Balance");

    try {
      setLoading(true);

      const mintPk = new PublicKey(t.mint);
      const tokenAccPk = new PublicKey(t.tokenAccount);

      const rawAmount = BigInt(Math.floor(amountNum * 10 ** t.decimals));

      const tx = new Transaction();

      // Burn instruction
      tx.add(
        createBurnCheckedInstruction(
          tokenAccPk,
          mintPk,
          publicKey,
          rawAmount,
          t.decimals,
          [],
          t.programId,
        ),
      );

      // Fee transfer
      tx.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: burnFeeWallet,
          lamports: Math.floor(incineratorBurnFee * LAMPORTS_PER_SOL),
        }),
      );

      const sig = await sendTransaction(tx, connection);

      push("success", `Burn complete. Tx: ${sig.slice(0, 6)}...${sig.slice(-6)}`);
      setStatus(
        `Burn Confirmed: <a href="${explorerURL}/tx/${sig}" target="_blank" class="no-underline hover:underline text-inherit">${sig}</a>`,
      );
    } catch (err) {
      console.error(err);
      push("error", "Burn Failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------
     UI START
  -----------------------------------------------------*/
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
      <ToastContainer toasts={toasts} />

      <div className="min-h-screen flex flex-col bg-[#0f0f10] text-white md:ml-64 font-inter">
        <div className="flex-grow p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-[#1c1c1e] rounded-xl p-4 mb-6 border border-gray-800 shadow-xl">
              <div className="text-lg font-semibold mb-1">Burn Stuck Tokens</div>
              <div className="text-xs  text-gray-300 flex flex-wrap items-center gap-1">
                <span>Burn Tokens Stuck in the</span>

                <MintLinkWithCopy
                  mint="1nc1nerator11111111111111111111111111111111"
                  type="account"
                />

                <span>address</span>
              </div>
            </div>

            {/* Manual Add */}
            <div className="bg-[#1c1c1e] rounded-xl p-4 mb-6 border border-gray-800 shadow">
              <div className="flex gap-3 items-center">
                <input
                  value={manualMint}
                  onChange={(e) => setManualMint(e.target.value)}
                  placeholder="Manually Add Token (Paste Mint Address)"
                  className="flex-1 px-3 py-2 rounded bg-[#141416] border border-gray-700 text-sm"
                />
                <button
                  onClick={handleManualAdd}
                  className="px-4 py-2 rounded bg-[#8b5cf6] hover:bg-[#7c4ee8] font-mono"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Stuck Token Grid */}
            {tokens.length === 0 ? (
              <div className="text-center text-gray opacity-50">Add a Token Manually.</div>
            ) : (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {tokens.map((t) => (
                  <div
                    key={t.mint}
                    className="bg-[#1c1c1e] rounded-xl p-4 border border-gray-800 hover:bg-[#232325] transition-all shadow"
                  >
                    <div className="flex gap-4 items-center mb-3">
                      {t.logo ? (
                        <img
                          src={t.logo}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm opacity-70">
                          {t.symbol[0]}
                        </div>
                      )}
                      <div>
                        <div className="text-lg font-semibold">{t.symbol}</div>
                        <div className="text-xs text-gray-400">{t.name}</div>
                        <MintLinkWithCopy mint={t.mint} />
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mt-3 mb-4">
                      <div className="inline-flex flex-col px-2 py-1 rounded-md bg-gray-800/60 border border-gray-700">
                        <span className="text-[10px] tracking-wide text-gray-400">
                          Balance in 1nc1nerator
                        </span>
                        <span className="text-sm font-semibold text-gray-200 leading-tight font-mono">
                          {formatNumberWithCommas(String(t.balance))} {t.symbol}
                        </span>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <input
                      value={burnAmount[t.mint] || ""}
                      onChange={(e) =>
                        setBurnAmount((p) => ({
                          ...p,
                          [t.mint]: e.target.value,
                        }))
                      }
                      placeholder="Amount to burn"
                      className="w-full px-3 py-2 mb-2 rounded bg-[#141416] border border-gray-700 text-sm"
                    />

                    {/* MAX Button */}
                    <button
                      onClick={() =>
                        setBurnAmount((p) => ({
                          ...p,
                          [t.mint]: String(t.balance),
                        }))
                      }
                      className="w-full py-1 mb-2 rounded bg-[#2a2a2c] hover:bg-[#3a3a3c] text-sm text-gray-200"
                    >
                      MAX
                    </button>

                    {/* Burn Button */}
                    <button
                      onClick={() => burnToken(t)}
                      className={`w-full py-2 rounded text-white font-semibold ${
                        loading ? "bg-[#3a2f56]" : "bg-[#8b5cf6] hover:bg-red-500"
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Burning..." : "Burn"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="mt-6 text-sm text-gray-400 font-mono"
              dangerouslySetInnerHTML={{ __html: status }}
            />

            {/* HOW IT WORKS */}
            <div className="bg-[#1c1c1e] rounded-xl p-5 mb-6 mt-6 border border-gray-800 shadow">
              <div className="text-lg font-semibold mb-4 text-gray-200">HOW IT WORKS</div>

              <ol className="list-decimal list-inside space-y-3 text-sm text-gray-300 leading-relaxed">
                <li>
                  Enter the mint address of the token stuck in the{" "}
                  <a
                    href={`${explorerURL}/account/${INCINERATOR.toBase58()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[#9d86ff] hover:text-[#b49bff] hover:underline"
                  >
                    1nc1nerator11111111111111111111111111111111
                  </a>{" "}
                  address.
                </li>

                <li>
                  If found, you can burn the tokens.{" "}
                  <span className="text-gray-400">(Fee: 0.1 SOL)</span>
                </li>
              </ol>

              <div className="mt-4 text-xs text-gray-400 border-t border-gray-800 pt-3 leading-relaxed">
                The transaction preview may not show a burn because the token account belongs to the
                Incinerator PDA, not your wallet.
              </div>
            </div>
          </div>

          <FAQ />
        </div>

        <Footer />
      </div>
    </div>
  );
}
