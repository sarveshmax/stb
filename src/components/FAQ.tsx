"use client";

import Script from "next/script";
import React from "react";

interface FAQItemType {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItemType[] = [
  {
    q: "Can I burn only a portion of my SPL or LP tokens?",
    a: "Yes. SolTokenBurner supports partial burns. Enter your desired amount under the token you want to burn, and confirm the transaction.",
  },
  {
    q: "Is burning tokens on Solana permanent?",
    a: "Yes. All burns on Solana are irreversible. Please double-check the token and amount before confirming.",
  },
  {
    q: "How do I verify that my tokens were burned?",
    a: "Click on the transaction hash that appears once the burn is completed. Alternatively, after completing a burn, go to SolScan and search for your wallet address. Your most recent transaction will display the on-chain burn details.",
  },
  {
    q: "Do I receive my SOL rent back when burning tokens?",
    a: "Yes, use the '💵 Cleaner' to close token accounts and claim SOL rent back. Burns on the normal Token Burner do not close your token account.",
  },
  {
    q: "When closing token accounts, where does the SOL come from?",
    a: "When you use the “💵 Cleaner” to close token accounts, you reclaim 0.002 SOL for each account. On Solana, you paid a small rent-exempt fee (storage fee) initially to create a token account. By closing the account, this deposited rent is returned to your wallet.",
  },
  {
    q: "Why do some tokens not appear in the Cleaner?",
    a: "To protect users, high-value stablecoins and LP tokens are hidden to prevent accidental burns. Some tokens that use Transfer Hooks or are Non-Transferable are also excluded, since they can fail or intentionally block burn and close actions. Use the Token Burner to burn these tokens.",
  },
  {
    q: "Why do some tokens show as 'Unknown' or 'UNK'?",
    a: "Some tokens lack proper metadata on-chain or through off-chain registries. If the name or symbol cannot be fetched reliably, SolTokenBurner displays them as 'Unknown' to prevent misidentification. Click on the token address to verify the name manually on Solscan.",
  },
  {
    q: "Is SolTokenBurner safe to use?",
    a: "Yes. All burns are executed directly on-chain from your connected wallet, no third-party trust is required. Visit our Blog to learn the technical breakdown on how SolTokenBurner burns tokens. SolTokenBurner is listed on Phantom Apps.",
  },
  {
    q: "Where can I find a SolTokenBurner tutorial?",
    a: "Tutorials are available in the menu, including both a detailed written guide in Blog and a YouTube walkthrough.",
  },
  {
    q: "Does SolTokenBurner have a new look?",
    a: "Yes. SolTokenBurner now has a refreshed design with new features. The old interface can still be accessed via '💣 Old SolTokenBurner' in the menu, but it is limited to testnet.",
  },
];

export default function Faq() {
  return (
    <div
      className="
        mt-12 bg-[#1c1c1e] rounded-xl p-6 
        border border-gray-800 
        shadow-[0_0_12px_rgba(0,0,0,0.4)]
        max-w-4xl mx-auto
      "
    >
      <h2 className="text-2xl font-bold mb-5 text-gray-200">FAQ</h2>

      {FAQ_ITEMS.map((item, idx) => (
        <FaqItem key={idx} q={item.q} a={item.a} idx={idx} />
      ))}

      {/* Structured Data */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((it) => ({
              "@type": "Question",
              name: it.q,
              acceptedAnswer: { "@type": "Answer", text: it.a },
            })),
          }),
        }}
      />
    </div>
  );
}

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = React.useState(false);
  const contentId = `faq-content-${idx}`;
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="mb-4 border-b border-gray-800 pb-3">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="
          flex justify-between items-center w-full text-left
          text-gray-200 hover:text-[#b49bff] transition-colors
        "
      >
        <span className="font-semibold text-lg leading-snug">{q}</span>

        {/* Chevron Icon */}
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            open ? "rotate-180 text-[#b49bff]" : "text-gray-400"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expandable Content */}
      <div
        id={contentId}
        ref={contentRef}
        style={{
          maxHeight: open ? contentRef.current?.scrollHeight : 0,
        }}
        className="
          overflow-hidden transition-all duration-300
        "
      >
        <p className="mt-2 text-sm text-gray-300 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}
