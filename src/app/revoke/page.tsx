"use client";

import React, { useEffect, useState } from "react";

import BottomBar from "@/components/BottomBar";
import FAQCreator from "@/components/FAQCreator";
import Footer from "@/components/Footer";
import MintLinkWithCopy from "@/components/MintLinkWithCopy";
import SideBar from "@/components/SideBar";
import ToastContainer from "@/components/ToastContainer";
import TopBar from "@/components/TopBar";

import { showBottomBar, tokenCreatorFeeWallet, tokenRevokeFee } from "@/constants";
import { withTimeout } from "@/utils/ConnectionHelpers";
import { getAnyTokenMetadata } from "@/utils/getMetadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import {
  AuthorityType,
  MintLayout,
  TOKEN_PROGRAM_ID,
  createSetAuthorityInstruction,
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
  hasMintAuthority: boolean;
  hasFreezeAuthority: boolean;
  programId: PublicKey;
}

export default function RevokePage() {
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;
  const { connection } = useConnection();

  const { toasts, push } = useToasts();
  const [open, setOpen] = useState(false);

  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  const [manualMint, setManualMint] = useState("");

  async function detectAuthorityTokens() {
    if (!publicKey) return push("error", "Connect wallet");

    setDetecting(true);
    setProgressText("Scanning Wallet Address…");
    setProgressPercent(10);
    setTokens([]);

    try {
      const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      setProgressPercent(30);
      setProgressText("Checking Authority on Token Mints…");

      const mintList: TokenInfo[] = [];

      for (const item of accounts.value) {
        const mintAddr = item.account.data.parsed.info.mint;
        const mintPK = new PublicKey(mintAddr);
        const mintAcc = await connection.getAccountInfo(mintPK);
        if (!mintAcc) continue;

        const mintData = MintLayout.decode(mintAcc.data);

        const hasMintAuth =
          mintData.mintAuthorityOption === 1 &&
          new PublicKey(mintData.mintAuthority).equals(publicKey);

        const hasFreezeAuth =
          mintData.freezeAuthorityOption === 1 &&
          new PublicKey(mintData.freezeAuthority).equals(publicKey);

        if (!hasMintAuth && !hasFreezeAuth) continue;

        const decimals = mintData.decimals;
        const supply = Number(mintData.supply) / 10 ** decimals;

        const metadata = await getAnyTokenMetadata(connection, mintPK.toBase58(), mintAcc.owner);

        mintList.push({
          mint: mintAddr,
          name: metadata.name,
          symbol: metadata.symbol,
          logo: metadata.image,
          supply: supply.toLocaleString(),
          decimals,
          hasMintAuthority: hasMintAuth,
          hasFreezeAuthority: hasFreezeAuth,
          programId: mintAcc.owner,
        });
      }

      setProgressPercent(90);
      setProgressText("Finalizing…");
      await new Promise((r) => setTimeout(r, 300));

      setTokens(mintList);
      setProgressPercent(100);
      setProgressText("Done");

      setTimeout(() => setDetecting(false), 500);
    } catch (err) {
      push("error", "Failed to Scan Wallet");
      console.error(err);
      setDetecting(false);
    }
  }

  async function handleManualAdd() {
    if (!manualMint) return push("error", "Enter a SPL Token Mint Address");
    if (tokens.some((t) => t.mint.toLowerCase() === manualMint.trim().toLowerCase()))
      return push("error", "Token Already Added");

    try {
      const mintPK = new PublicKey(manualMint);
      const mintAcc = await connection.getAccountInfo(mintPK);
      if (!mintAcc) return push("error", "Invalid mint address");

      push("info", "Adding Token...");
      const mintData = MintLayout.decode(mintAcc.data);
      const decimals = mintData.decimals;
      const supply = Number(mintData.supply) / 10 ** decimals;

      const hasMintAuth =
        mintData.mintAuthorityOption === 1 &&
        new PublicKey(mintData.mintAuthority).equals(
          publicKey ?? new PublicKey("11111111111111111111111111111111"),
        );

      const hasFreezeAuth =
        mintData.freezeAuthorityOption === 1 &&
        new PublicKey(mintData.freezeAuthority).equals(
          publicKey ?? new PublicKey("11111111111111111111111111111111"),
        );

      const metadata = await withTimeout(
        getAnyTokenMetadata(connection, mintPK.toBase58(), mintAcc.owner),
        5 * 1000, //5 Second Timeout
        { name: "Unknown", symbol: "UNK", image: "/unknowntoken.png" },
      );

      setTokens((prev) => [
        ...prev,
        {
          mint: mintPK.toBase58(),
          name: metadata.name,
          symbol: metadata.symbol,
          logo: metadata.image,
          supply: supply.toLocaleString(),
          decimals,
          hasMintAuthority: hasMintAuth,
          hasFreezeAuthority: hasFreezeAuth,
          programId: mintAcc.owner,
        },
      ]);

      push("success", "Token Added");
      setManualMint("");
    } catch (err) {
      push("error", "Invalid Token");
    }
  }

  async function revokeMintAuth(t: TokenInfo) {
    if (!publicKey) return push("error", "Connect Wallet");

    try {
      const mintPK = new PublicKey(t.mint);
      const programId = t.programId;

      const ix = createSetAuthorityInstruction(
        mintPK,
        publicKey,
        AuthorityType.MintTokens,
        null,
        [],
        programId,
      );

      const tx = new Transaction().add(ix);
      // Fee transfer
      tx.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: tokenCreatorFeeWallet,
          lamports: Math.floor(tokenRevokeFee * LAMPORTS_PER_SOL),
        }),
      );
      await sendTransaction(tx, connection);

      push("success", "Mint Authority Revoked");

      detectAuthorityTokens();
    } catch (err) {
      push("error", "Failed to Revoke");
      // console.log(err);
    }
  }

  async function revokeFreezeAuth(t: TokenInfo) {
    if (!publicKey) return push("error", "Connect Wallet");

    try {
      const mintPK = new PublicKey(t.mint);
      const programId = t.programId;

      const ix = createSetAuthorityInstruction(
        mintPK,
        publicKey,
        AuthorityType.FreezeAccount,
        null,
        [],
        programId,
      );

      const tx = new Transaction().add(ix);
      // Fee transfer
      tx.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: tokenCreatorFeeWallet,
          lamports: Math.floor(tokenRevokeFee * LAMPORTS_PER_SOL),
        }),
      );

      await sendTransaction(tx, connection);

      push("success", "Freeze Authority Revoked");

      detectAuthorityTokens();
    } catch (err) {
      push("error", "Failed to Revoke");
      // console.log(err);
    }
  }

  //AUTO-LOAD TOKENS FROM WALLET ON LOADING WEBPAGE & CHANGING WALLET
  useEffect(() => {
    if (publicKey) {
      detectAuthorityTokens();
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
            {/* Wallet Controls */}
            <div className="bg-[#1c1c1e] rounded-xl p-4 mb-6 border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
              <div className="flex justify-between items-center text-sm">
                <div className=" mb-1">
                  <div className="text-lg font-semibold tracking-wide text-white">
                    Revoke Mint & Freeze Authority
                  </div>
                  <div className="text-xs text-gray-400">Manage Token Authorities</div>
                </div>

                <button
                  onClick={detectAuthorityTokens}
                  className={`px-4 py-2 rounded-md font-mono text-sm ${
                    detecting ? "bg-[#3a2f56] text-gray-300" : "bg-[#8b5cf6] hover:bg-[#7c4ee8]"
                  }`}
                >
                  {detecting ? "Fetching..." : "Auto-Detect"}
                </button>
              </div>

              {detecting && (
                <div className="mt-3">
                  <div className="text-sm text-[#DDD7FE]">{progressText}</div>
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
                  className="flex-1 px-3 py-2 text-sm rounded bg-[#141416] border border-gray-700"
                />
                <button
                  onClick={handleManualAdd}
                  className="px-4 py-2 rounded-md bg-[#8b5cf6] hover:bg-[#7c4ee8] text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Tokens Grid */}
            {tokens.length === 0 ? (
              <div className="text-center opacity-60 text-gray-300">
                Click Auto-Detect to load tokens with Mint or Freeze Authority.
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))] pb-6">
                {tokens.map((t) => (
                  <div
                    key={t.mint}
                    className="bg-[#1c1c1e] rounded-xl p-4 border border-gray-800 hover:bg-[#232325] hover:scale-[1.02] transition-all shadow-[0_0_10px_rgba(0,0,0,0.35)]"
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
                      </div>
                    </div>

                    {/* Buttons */}
                    {t.hasMintAuthority && (
                      <button
                        onClick={() => revokeMintAuth(t)}
                        className="w-full mb-2 py-2 rounded bg-[#8b5cf6] hover:bg-[#7c4ee8] text-white font-semibold text-sm"
                      >
                        🌱 Revoke Mint
                      </button>
                    )}

                    {t.hasFreezeAuthority && (
                      <button
                        onClick={() => revokeFreezeAuth(t)}
                        className="w-full mb-2 py-2 rounded bg-[#8b5cf6] hover:bg-[#7c4ee8] text-white font-semibold text-sm"
                      >
                        ❄️ Revoke Freeze
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <FAQCreator />
        </div>

        <Footer />
      </div>
    </div>
  );
}
