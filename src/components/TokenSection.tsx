"use client";

import React from "react";
import MintLinkWithCopy from "./MintLinkWithCopy";

import { formatNumberWithCommas } from "@/utils/NumberHelpers";
import { PublicKey } from "@solana/web3.js";
import { motion } from "framer-motion";
import { Wallet, X } from "lucide-react";
import EmptyState from "./EmptyState";

type TokenSectionProps = {
  title: string;
  tokenList: any[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelect: (mint: string) => void;
  isNFT?: boolean;
  isVacant?: boolean;
  publicKey?: PublicKey | null;
};

export default function TokenSection({
  title,
  tokenList,
  selected,
  setSelected,
  toggleSelect,
  isNFT = false,
  isVacant = false,
  publicKey = null,
}: TokenSectionProps) {
  // Handle empty list with animation
  if (!publicKey) {
    return (
      <motion.div
        className="
        flex flex-col items-center justify-center
        py-10
        text-gray-400/70
        opacity-60
        tracking-widest
      "
      >
        <EmptyState icon={Wallet} title="WALLET NOT CONNECTED" paddingVertical="py-20" />
      </motion.div>
    );
  } else {
    if (!tokenList || tokenList.length === 0) {
      const msg = title.toLowerCase().includes("zero-balance")
        ? "NO ZERO-BALANCE TOKEN ACCOUNTS"
        : title.toLowerCase().includes("balance")
          ? "NO TOKEN ACCOUNTS WITH BALANCE"
          : title.toLowerCase().includes("nft")
            ? "NO NFTs FOUND"
            : "NO ITEMS";

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          className="
        flex flex-col items-center justify-center
        py-10
        text-gray-400/70
        opacity-60
        tracking-widest
      "
        >
          <EmptyState icon={X} title={msg} paddingVertical="py-10" />
        </motion.div>
      );
    }
  }

  const selectAll = () =>
    setSelected((prev) => [...new Set([...prev, ...tokenList.map((t) => t.mint)])]);

  const clearAll = () =>
    setSelected((prev) => prev.filter((mint) => !tokenList.some((t) => t.mint === mint)));

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="text-s font-bold tracking-wide opacity-80">{title}</div>

        <div className="flex items-center gap-3">
          {selected.length > 0 && (
            <button onClick={clearAll} className="text-s text-[#8b5cf6] hover:underline">
              Clear
            </button>
          )}
          <button onClick={selectAll} className="text-s text-[#8b5cf6] hover:underline">
            Select All
          </button>
        </div>
      </div>

      {/* Animated content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.1, ease: "linear" }}
      >
        <div className="space-y-3">
          {tokenList.map((t) => {
            const active = selected.includes(t.mint);

            return (
              <div
                key={t.mint}
                onClick={() => toggleSelect(t.mint)}
                className={`
                  flex items-center gap-4 p-3 px-5 rounded-xl
                  border border-gray-800 bg-[#1c1c1e]
                  cursor-pointer transition-all 
                  hover:bg-[#232325] hover:scale-[1.01]
                  ${active ? "ring-2 ring-[#8b5cf6] bg-[#21172d]" : ""}
                `}
              >
                {/* Checkbox */}
                <div
                  className={`
                    w-5 h-5 rounded border
                    ${active ? "bg-[#8b5cf6] border-[#8b5cf6]" : "border-gray-500"}
                  `}
                />

                {/* Logo */}
                {t.logo ? (
                  <img
                    src={t.logo || "/unknowntoken.png"}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-700"
                    onError={(e) => {
                      e.currentTarget.onerror = null; // prevent loop
                      e.currentTarget.src = "/unknowntoken.png";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                    {t.symbol?.[0]}
                  </div>
                )}

                {/* Name & Symbol */}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-200">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.symbol}</div>

                  {/* Balance */}
                  {!isNFT && !isVacant && (
                    <div className="text-sm text-gray-300">{formatNumberWithCommas(t.balance)}</div>
                  )}

                  {/* Mobile address */}
                  <div className="sm:hidden mt-1 text-left text-xs opacity-80">
                    <MintLinkWithCopy
                      mint={t.mint}
                      linkClassName="text-gray-400 hover:text-gray-200"
                    />
                  </div>
                </div>

                {/* Desktop address */}
                <div className="hidden sm:flex flex-col items-end text-right text-xs opacity-80">
                  <MintLinkWithCopy
                    mint={t.mint}
                    linkClassName="text-gray-400 hover:text-gray-200"
                    containerClassName="justify-end"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
