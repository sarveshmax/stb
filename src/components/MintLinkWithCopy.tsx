"use client";

import { explorerURL } from "@/constants";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type MintLinkProps = {
  mint: string;
  linkClassName?: string;
  containerClassName?: string;
  type?: "token" | "account" | "tx";
};

export default function MintLinkWithCopy({
  mint,
  linkClassName = "text-[#9d86ff] hover:text-[#b49bff]",
  containerClassName = "",
  type = "token",
}: MintLinkProps) {
  const [copied, setCopied] = useState(false);

  const linkTitleMap: Record<string, string> = {
    token: "Open Mint in SolScan",
    account: "Open Account in SolScan",
    tx: "Open Transaction in SolScan",
  };

  const copyTitleMap: Record<string, string> = {
    token: "Copy Mint Address",
    account: "Copy Account Address",
    tx: "Copy Tx Hash",
  };

  const linkTitle = linkTitleMap[type] ?? "Open in SolScan";
  const copyTitle = copyTitleMap[type] ?? "Copy Address";

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
        href={`${explorerURL}/${type}/${mint}`}
        title={linkTitle}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center gap-1 text-xs font-mono ${linkClassName}`}
      >
        <span className="break-all">
          {mint.slice(0, 7)}…{mint.slice(-7)}
        </span>
      </a>

      <button
        onClick={handleCopy}
        title={copyTitle}
        className="p-1 rounded hover:bg-[#2a2a2c] text-gray-400 hover:text-white transition"
      >
        {copied ? <Check size={10} className="text-gray-300" /> : <Copy size={10} />}
      </button>
    </div>
  );
}
