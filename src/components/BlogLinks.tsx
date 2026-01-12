"use client";

import { Icon } from "@iconify/react";

/* ===== LOCAL ICON MAP (USED ONLY FOR LINK ICONS - UNCHANGED) ===== */
const ICONS: Record<string, { src: string; alt: string }> = {
  "/": { src: "/sidebaricons/burn.svg", alt: "Token Burner" },
  "/cleaner": { src: "/sidebaricons/wallet.svg", alt: "Cleaner (Claim SOL)" },
  "/create": { src: "/sidebaricons/create.svg", alt: "Create Solana Token" },
  "/mint": { src: "/sidebaricons/mint.svg", alt: "Mint Tokens" },
  "/revoke": { src: "/sidebaricons/revoke.svg", alt: "Revoke Authority" },
  "/frozen": { src: "/sidebaricons/frozen.svg", alt: "Check Frozen Tokens" },
  "/blog": { src: "/sidebaricons/blog.svg", alt: "Blog" },
};

/* ===== ICON COMPONENT FOR LINK ICONS ===== */
function InlineIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={16}
      height={16}
      loading="lazy"
      decoding="async"
      className="w-4 h-4 object-contain"
    />
  );
}

export default function BlogLinks() {
  const guideLinks = [
    {
      href: "/blog/how-soltokenburner-works",
      label: "How SolTokenBurner Works (Technical Breakdown)",
    },
    {
      href: "/blog/burn-solana-spl-lp-tokens",
      label: "How to Burn SPL & LP Tokens on Solana",
    },
    {
      href: "/blog/burn-lp-tokens-solana",
      label: "How to Burn LP Tokens (Liquidity Pool) on Solana",
    },
    {
      href: "/blog/dead-wallet-address-solana",
      label: "Dead Wallet Address on Solana (Explained)",
    },
    {
      href: "/blog/dexscreener-padlock-liquidity-lock",
      label: "How to Get Padlock on DexScreener (Tutorial)",
    },
    {
      href: "/blog/burn-tokens-phantom",
      label: "How to Burn Tokens on Phantom",
    },
    {
      href: "/blog/solana-burn-address",
      label: "What Is Solana’s Burn Address",
    },
    {
      href: "/blog/sol-incinerator-alternative",
      label: "Why SolTokenBurner Is the Best Token Burner",
    },
  ];

  const toolsLinks = [
    { href: "/", label: "Token Burner" },
    { href: "/cleaner", label: "Cleaner (Claim SOL)" },
    { href: "/create", label: "Create Solana Token" },
    { href: "/mint", label: "Mint Tokens" },
    { href: "/revoke", label: "Revoke Authority" },
    { href: "/frozen", label: "Check Frozen Tokens" },
  ];

  const homepageLinks = [{ href: "/blog", label: "Blog Homepage" }];

  return (
    <div className="mt-10 mb-0 p-5 bg-[#161616] rounded-xl border border-white/10">
      {/* GUIDES - ICONIFY ONLY */}
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Icon icon="fluent-emoji-flat:open-book" className="w-[22px] h-[22px]" />
        Guides
      </h3>

      <ul className="space-y-2 mb-6">
        {guideLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-blue-400 hover:text-blue-300 underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* TOOLS - ICONIFY ONLY */}
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Icon icon="fluent-color:star-24" className="w-[22px] h-[22px]" />
        Tools
      </h3>

      <ul className="space-y-2 mb-6">
        {toolsLinks.map((link) => {
          const iconData = ICONS[link.href];
          return (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 underline"
              >
                {iconData && <InlineIcon src={iconData.src} alt={iconData.alt} />}
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>

      {/* HOME - ICONIFY ONLY */}
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Icon icon="fluent-color:home-32" className="w-[22px] h-[22px]" />
        Home
      </h3>

      <ul className="space-y-2">
        {homepageLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 underline"
            >
              <InlineIcon src={ICONS["/blog"].src} alt={ICONS["/blog"].alt} />
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
