"use client";

import { useState } from "react";

import BottomBar from "@/components/BottomBar";
import Footer from "@/components/Footer";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";

import { showBottomBar } from "@/constants";
import { Icon } from "@iconify/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AlertTriangle, FileText, Lock } from "lucide-react";

export default function TermsPage() {
  const { publicKey } = useWallet();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen
        pb-[var(--mobile-bottom-bar-height)]"
    >
      <TopBar account={publicKey?.toBase58()} open={open} setOpen={setOpen} />
      {showBottomBar && <BottomBar open={open} />}
      <SideBar open={open} setOpen={setOpen} />

      <div className="min-h-screen flex flex-col bg-[#0f0f10] text-white md:ml-64 font-inter">
        <div className="flex-grow p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* HERO */}
            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#141416] rounded-2xl p-6 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-3 mb-2">
                <Icon icon="streamline-color:information-circle" width={26} height={26} />
                <h1 className="text-2xl font-bold tracking-tight">Terms & Privacy</h1>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                This page outlines the Terms & Conditions, Privacy Policy, and Disclaimer for using
                SolTokenBurner. By using this website, you agree to the conditions described below.
              </p>
            </div>

            {/* TERMS */}
            <section className="bg-[#1c1c1e] rounded-2xl p-6 border border-gray-800 space-y-4">
              <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                <FileText size={18} className="text-[#8b5cf6]" />
                Terms & Conditions
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed">
                SolTokenBurner is a non-custodial, self-service utility that allows users to
                interact directly with the Solana blockchain. All actions - including burning
                tokens, closing token accounts, and claiming SOL rent - are initiated and approved
                by the user from their own wallet.
              </p>

              <p className="text-sm text-gray-300 leading-relaxed">
                SolTokenBurner is a non-custodial tool and does not control user wallets or funds.
                All transactions are approved directly within your wallet and executed on-chain.
              </p>

              <p className="text-sm text-gray-300 leading-relaxed">
                By using this site, you agree that SolTokenBurner and its contributors are not
                responsible for any loss of tokens, NFTs, SOL, or other digital assets caused by
                user actions, token mechanics, smart contract behavior, or third-party programs.
              </p>
            </section>

            {/* PRIVACY */}
            <section className="bg-[#1c1c1e] rounded-2xl p-6 border border-gray-800 space-y-4">
              <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                <Lock size={18} className="text-[#8b5cf6]" />
                Privacy Policy
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed">
                SolTokenBurner does not collect, store, or process personal data of any kind.
              </p>

              <p className="text-sm text-gray-300 leading-relaxed">
                We do not store wallet addresses, IP addresses, device identifiers, or usage
                analytics.
              </p>

              <p className="text-sm text-gray-300 leading-relaxed">
                We do not use cookies, analytics, or tracking tools.
              </p>

              <p className="text-sm text-gray-300 leading-relaxed">
                All interactions occur directly between your wallet and the Solana blockchain. Token
                data is fetched in real time from public RPC endpoints or third-party APIs.
              </p>
            </section>

            {/* DISCLAIMER */}
            <section className="bg-[#1c1c1e] rounded-2xl p-6 border border-gray-800 space-y-4">
              <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#8b5cf6]" />
                Disclaimer
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed">
                SolTokenBurner is provided on an “as is” and “as available” basis, without
                warranties of any kind. This platform does not provide financial, investment, or
                legal advice.
              </p>

              <p className="text-sm text-gray-300 leading-relaxed">
                Token behavior may vary due to custom programs, transfer hooks, non-transferable
                rules, extensions, or protocol-level changes. Some tokens may be intentionally
                impossible to burn or close.
              </p>

              <p className="text-sm text-gray-300 leading-relaxed">
                You assume full responsibility for any transaction you approve. SolTokenBurner is
                not responsible for accidental burns, unintended losses, failed transactions, or
                unexpected token behavior.
              </p>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
