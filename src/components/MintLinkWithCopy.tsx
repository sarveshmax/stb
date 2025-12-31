"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { explorerURL } from "@/constants";

type MintLinkProps = {
  mint: string;
  linkClassName?: string;
  containerClassName?: string;
};

export default function MintLinkWithCopy({
  mint,
  linkClassName = "text-[#9d86ff] hover:text-[#b49bff]",
  containerClassName = "",
}: MintLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await navigator.clipboard.writeText(mint);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex items-center gap-0 ${containerClassName}`}>
      <a
        href={`${explorerURL}/token/${mint}`}
        title="Open Mint in SolScan"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`inline-flex items-center gap-1 text-xs font-mono ${linkClassName}`}
      >
        <span className="break-all">
          {mint.slice(0, 7)}…{mint.slice(-7)}
        </span>
      </a>

      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-[#2a2a2c] text-gray-400 hover:text-white transition"
        title="Copy Mint Address"
      >
        {copied ? (
          <Check size={10} className="text-gray" />
        ) : (
          <Copy size={10} />
        )}
      </button>
    </div>
  );
}
