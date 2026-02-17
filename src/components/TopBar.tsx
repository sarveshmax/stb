"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ShieldCheck } from "lucide-react";
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
          className="
    bg-[#2b1e44]/70 backdrop-blur-md
    border-b border-[#8b5cf6]/30
    text-purple-100 text-sm text-center
    px-4 py-2 relative
  "
        >
          <ShieldCheck size={16} className="inline mr-2 -mt-0.5 text-purple-300" />
          Some wallets may show a warning. SolTokenBurner is open-source. All balance changes are
          shown before you approve.
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

          <a href="https://www.soltokenburner.com" className="flex items-center gap-3 ml-5">
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
      <div className="pt-[120px]" />
    </>
  );
}
