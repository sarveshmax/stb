"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaBars } from "react-icons/fa";

interface Props {
  account?: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function TopBar({ account, open, setOpen }: Props) {
  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div
        className="
          fixed top-0 left-0 w-full h-20
          bg-[#1c1c1e]
          border-b border-gray-800
          shadow-[0_0_12px_rgba(0,0,0,0.45)]
          flex items-center justify-between px-4 z-50
        "
      >
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-[#232325] transition"
          onClick={() => setOpen(!open)}
        >
          <FaBars size={22} className="text-gray-200" />
        </button>

        {/* Logo + Title */}
        <a href="https://www.soltokenburner.com" className="flex items-center gap-3 ml-5">
          <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
          <span className="hidden md:inline text-2xl font-extrabold tracking-wider text-white">
            SolTokenBurner
          </span>
        </a>

        {/* Wallet Button */}
        <div className="flex items-center">
          <WalletMultiButton className="!bg-[#8b5cf6] hover:!bg-[#7c4ee8] !text-white !font-semibold !rounded-lg !shadow-lg !shadow-[#8b5cf6]/20" />
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
