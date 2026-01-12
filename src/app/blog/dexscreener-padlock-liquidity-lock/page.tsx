import BlogLinks from "@/components/BlogLinks";
import Footer from "@/components/Footer";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "How to Get the Padlock on Dexscreener | LP Lock Badge Guide 2025",
  description:
    "Learn how to get the padlock icon on Dexscreener by burning your LP tokens on Solana. Works for Raydium, Orca, Meteora and all SPL LP tokens.",
  alternates: {
    canonical: "https://www.soltokenburner.com/blog/dexscreener-padlock-liquidity-lock",
  },
  openGraph: {
    title: "How to Get the Padlock on Dexscreener | LP Lock Badge Guide 2025",
    description:
      "Learn how to get the padlock icon on Dexscreener by burning your LP tokens on Solana. Works for Raydium, Orca, Meteora and all SPL LP tokens.",
    url: "https://www.soltokenburner.com/blog/dexscreener-padlock-liquidity-lock",
    images: ["/og-image.png"],
  },
};

export default function DexPadlockGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        How to Get the Padlock on Dexscreener (LP Lock Badge)
      </h1>

      <p className="mb-6">
        The padlock icon on Dexscreener appears when your liquidity is locked or burned. On Solana,
        the simplest and most trusted way to get this padlock is by{" "}
        <strong>burning the LP tokens</strong> that the DEX (Raydium, Orca, Meteora, etc.) gives you
        when you create a liquidity pool.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:locked" className="text-2xl" />
        Why the Padlock Appears
      </h2>

      <p className="mb-6">
        Dexscreener automatically detects when the supply of an LP token becomes zero. Burning LP
        tokens locks liquidity permanently, meaning nobody (including devs) can withdraw it. This
        gives a strong trust signal to traders. You can also partially burn the LP, but the green
        circle around the padlock will only be filled completely if you burn 100%.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:rocket" className="text-2xl" />
        How to Burn LP Tokens for the Padlock (Step-by-Step)
      </h2>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-one-fill" className="text-xl" />
        Open SolTokenBurner
      </h3>
      <p className="mb-4">
        Go to{" "}
        <a
          href="https://www.soltokenburner.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 underline"
        >
          https://www.soltokenburner.com/
        </a>{" "}
        and connect your Phantom wallet.
      </p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-two-fill" className="text-xl" />
        Click REFRESH
      </h3>
      <p className="mb-4">Your SPL/LP tokens will load automatically.</p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-three-fill" className="text-xl" />
        Select the LP Token
      </h3>
      <p className="mb-4">
        LP tokens appear with random letters like <strong>aBcytDz...hshYfa</strong> or names like{" "}
        <strong>RAY-LP</strong>, <strong>ORCA-LP</strong>, <strong>POOL-LP</strong>, etc.
      </p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-four-fill" className="text-xl" />
        Choose Burn Amount
      </h3>

      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>
          <strong>MAX</strong> (recommended) - burns the LP completely
        </li>
        <li>
          <strong>Custom Amount</strong> - only if partial burn is needed. The unburned LP can be
          removed (withdraw liquidity) or burned later.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-five-fill" className="text-xl" />
        Approve the Burn
      </h3>
      <p className="mb-6">
        Phantom will ask for approval. After confirmation, the LP tokens are permanently removed.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:magnifying-glass-tilted-right" className="text-2xl" />
        When Does the Padlock Show?
      </h2>

      <p className="mb-6">
        Dexscreener checks the pool automatically. The padlock usually appears{" "}
        <strong>instantly</strong> or within <strong>5–10 minutes</strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:question-mark" className="text-2xl" />
        FAQs
      </h2>

      <h3 className="text-xl font-semibold mb-3">Does Dexscreener require manual submission?</h3>
      <p className="mb-6">No. It detects LP burn on-chain automatically.</p>

      <h3 className="text-xl font-semibold mb-3">Is LP burning permanent?</h3>
      <p className="mb-6">Yes - burned LP cannot be recovered.</p>

      <h3 className="text-xl font-semibold mb-3">Will the padlock disappear?</h3>
      <p className="mb-5">No. Burned liquidity stays locked forever.</p>

      <p className="text-gray-400 mb-10 text-sm">Updated: December 2025</p>

      <BlogLinks />
    </div>
  );
}
