"use client";

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
      label: "How to get Padlock on DexScreener (Tutorial)",
    },
    {
      href: "/blog/burn-tokens-phantom",
      label: "How to Burn Tokens on Phantom",
    },
    {
      href: "/blog/solana-burn-address",
      label: "What is Solana's Burn Address",
    },
    {
      href: "/blog/sol-incinerator-alternative",
      label: "Why SolTokenBurner is the Only & Best Solana Token Burner",
    },
  ];

  const toolsLinks = [
    { href: "/", label: "🔥 Token Burner" },
    { href: "/cleaner", label: "🔨 Create a Solana Token" },
    { href: "/create", label: "🌱 Mint Tokens" },
    { href: "/mint", label: "🔒 Revoke Mint & Freeze Authority" },
    { href: "/revoke", label: "🥶 Check Frozen Token Accounts" },
    { href: "/frozen", label: "💵 Cleaner (Claim Sol)" },
  ];

  const homepageLinks = [{ href: "/blog", label: "📘 Blog Homepage" }];

  return (
    <div className="mt-10 mb-0 p-5 bg-[#161616] rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold mb-3">🔗 Guides</h3>

      <ul className="space-y-2 mb-6">
        {guideLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-3">🛠️ Tools</h3>

      <ul className="space-y-2 mb-6">
        {toolsLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-3">🏠 Home</h3>

      <ul className="space-y-2">
        {homepageLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
