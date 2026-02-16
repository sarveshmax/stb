"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AlertTriangle } from "lucide-react";
import { FaBars } from "react-icons/fa";

interface Props {
  account?: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  disableConnectWalletButton?: boolean;
  disableMenuIconMobile?: boolean;
}

export default function TopBar({
  account,
  open,
  setOpen,
  disableConnectWalletButton = false,
  disableMenuIconMobile = false,
}: Props) {
  return (
    <>
      {/* ===== FIXED HEADER WRAPPER ===== */}
      <div id="site-header" className="fixed top-0 left-0 w-full z-50">
        {/* WARNING BANNER */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            max-h-40 opacity-100}
          `}
        >
          <div
            className="
              bg-red-900/60 backdrop-blur-md
              border-b border-red-700/40
              text-red-200 text-sm text-center
              px-4 py-2 relative
            "
          >
            <AlertTriangle size={16} className="inline mr-2 -mt-0.5 text-red-300" />
            We need your help. SolTokenBurner is currently being incorrectly flagged as malicious by
            Phantom. We are actively working to resolve this. Please visit{" "}
            <a
              href="https://help.phantom.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-red-100"
            >
              help.phantom.com
            </a>
            , click on the chat icon (bottom-right) and let them know that SolTokenBurner is a
            legitimate SOL burn & rent reclaim tool. Your help is greatly appreciated.
            {/* Close Button */}
            {/* <button
              onClick={dismissBanner}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         p-1 rounded hover:bg-red-800/40 transition"
            >
              <X size={16} />
            </button> */}
          </div>
        </div>

        {/* TOP BAR */}
        <div
          className="
            h-20
            bg-[#1c1c1e]
            border-b border-gray-800
            shadow-[0_0_12px_rgba(0,0,0,0.45)]
            flex items-center justify-between px-4
          "
        >
          {!disableMenuIconMobile && (
            <button
              className="md:hidden p-2 rounded hover:bg-[#232325] transition"
              onClick={() => setOpen(!open)}
            >
              <FaBars size={22} className="text-gray-200" />
            </button>
          )}

          <a href="https://www.soltokenburner.fun" className="flex items-center gap-3 ml-5">
            <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
            <span className="hidden md:inline text-2xl font-extrabold tracking-wider text-white">
              SolTokenBurner
            </span>
          </a>

          {!disableConnectWalletButton && (
            <WalletMultiButton className="!bg-[#8b5cf6] hover:!bg-[#7c4ee8] !text-white !font-semibold !rounded-lg !shadow-lg !shadow-[#8b5cf6]/20" />
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="pt-[160px] md:pt-[140px]" />
    </>
  );
}
