import { Icon } from "@iconify/react";
import Link from "next/link";

export const metadata = {
  title: "Solana Token Burner Blog | SolTokenBurner",
  description:
    "Learn how to burn SPL tokens, LP tokens, lock liquidity, get the Dexscreener padlock, and more. Official Solana burning guides by SolTokenBurner.",
  alternates: {
    canonical: "https://www.soltokenburner.com/blog",
  },
  openGraph: {
    title: "Solana Token Burner Blog | SolTokenBurner",
    description:
      "Guides and tutorials for burning tokens and LP tokens on the Solana blockchain using SolTokenBurner.",
    url: "https://www.soltokenburner.com/blog",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Token Burner Blog | SolTokenBurner",
    description:
      "Official guides for burning tokens, LP tokens, and understanding Solana mechanics.",
    images: ["/og-image.png"],
  },
};

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-12 text-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-gray-100 flex items-center gap-3">
        <Icon icon="fluent-emoji-flat:blue-book" className="w-12 h-12 sm:w-10 sm:h-10" />
        Solana Token Burner Blog
      </h1>

      <p className="mb-10 text-gray-300 leading-relaxed">
        Guides, tutorials, and documentation for burning SPL tokens, LP tokens, locking liquidity,
        and understanding Solana’s token burn mechanics - all powered by SolTokenBurner.
      </p>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-1">Blog Articles</h3>

        <BlogLink
          icon="flat-color-icons:settings"
          title="How SolTokenBurner Works (Technical Breakdown)"
          url="/blog/how-soltokenburner-works"
        />

        <BlogLink
          icon="emojione:fire"
          title="How to Burn SPL or LP Tokens on Solana"
          url="/blog/burn-solana-spl-lp-tokens"
        />

        <BlogLink
          icon="token-branded:meme"
          title="How to Create Meme Token & Add Liquidity on Solana"
          url="/blog/create-solana-token"
        />

        <BlogLink
          icon="icon-park:water-no"
          title="How to Burn Liquidity Pool Tokens on Solana"
          url="/blog/burn-lp-tokens-solana"
        />

        <BlogLink
          icon="flat-color-icons:cancel"
          title="Solana Dead Wallet Address (Why It Doesn't Exist)"
          url="/blog/dead-wallet-address-solana"
        />

        <BlogLink
          icon="fluent-emoji-flat:ghost"
          title="Burn Tokens Using Phantom Wallet"
          url="/blog/burn-tokens-phantom"
        />

        <BlogLink
          icon="fxemoji:lock"
          title="Get Dexscreener Padlock by Burning LP"
          url="/blog/dexscreener-padlock-liquidity-lock"
        />

        <BlogLink
          icon="token-branded:zero-network"
          title="Solana Burn Address - What is it?"
          url="/blog/solana-burn-address"
        />

        <BlogLink
          icon="icon-park:gold-medal"
          title="Why SolTokenBurner is the Best"
          url="/blog/sol-incinerator-alternative"
        />

        <br />
        <h3 className="text-xl font-semibold mb-1">External Links</h3>

        <BlogLink
          icon="logos:youtube-icon"
          title="YouTube – Burning Tokens & LP"
          url="https://youtu.be/5Tg2vljl6n4"
        />
      </div>

      <div className="h-20" />
    </div>
  );
}

function BlogLink({ title, url, icon }: { title: string; url: string; icon: string }) {
  const isExternal = url.startsWith("http");

  const cardClasses = `
  p-5
  bg-[#1c1c1e]
  border border-gray-800
  shadow-[0_0_12px_rgba(0,0,0,0.35)]
  hover:border-gray-600
  transition cursor-pointer
  flex items-center
`;

  const content = (
    <div className={cardClasses}>
      <div className="flex items-center gap-4 w-full">
        {/* Icon – no background */}
        <Icon icon={icon} width={34} className="text-gray-300 shrink-0" />

        {/* Text */}
        <div>
          <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
          <p className="text-sm text-gray-400 mt-1">{url}</p>
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={url}>{content}</Link>;
}
