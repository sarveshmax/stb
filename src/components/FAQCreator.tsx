"use client";

import Script from "next/script";
import React from "react";

interface FAQItemType {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItemType[] = [
  {
    q: "What can I do with the Token Creator?",
    a: "You can create new SPL tokens, mint additional supply, freeze or unfreeze accounts, and revoke mint or freeze authority - all directly from your connected wallet.",
  },
  {
    q: "Can I mint more tokens after creation?",
    a: "As long as you still hold Mint Authority. Use the 'Mint Tokens' page, enter the amount you want, and approve the transaction.",
  },
  {
    q: "What happens if I revoke Mint Authority?",
    a: "Revoking Mint Authority permanently prevents any future token minting. Revoking this confirms you won't mint more tokens in the future and dump it, you it is recommended to revoke this.",
  },
  {
    q: "What is Freeze Authority and should I revoke it?",
    a: "Freeze Authority allows you to freeze or unfreeze token accounts. Many creators revoke it for trust and transparency. It needs to be revoked to add liqudity on Raydium.",
  },
  {
    q: "Where can I see my token after creating it?",
    a: "Your newly created token will appear automatically in your Phantom wallet. You can also verify it on SolScan by searching your wallet address or the token mint.",
  },
  {
    q: "Is the Token Creator safe to use?",
    a: "Yes. All actions happen directly on-chain from your wallet.",
  },
];

export default function FAQCreator() {
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

      {/* Structured Data for SEO */}
      <Script
        id="faq-schema-token-creator"
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
