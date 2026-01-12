import BlogLinks from "@/components/BlogLinks";
import Footer from "@/components/Footer";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "How to Burn Tokens in Phantom Wallet | Complete 2025 Guide",
  description:
    "A simple beginner-friendly guide on how to burn SPL tokens and LP tokens using Phantom Wallet with SolTokenBurner. No technical knowledge required.",
  alternates: {
    canonical: "https://www.soltokenburner.com/blog/burn-tokens-phantom",
  },
  openGraph: {
    title: "How to Burn LP Tokens on Solana | Complete 2025 Guide",
    description:
      "A simple beginner-friendly guide on how to burn SPL tokens and LP tokens using Phantom Wallet with SolTokenBurner. No technical knowledge required.",
    url: "https://www.soltokenburner.com/blog/burn-tokens-phantom",
    images: ["/og-image.png"],
  },
};

export default function PhantomBurnGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">How to Burn Tokens in Phantom Wallet</h1>

      <p className="mb-6">
        Phantom used to include a built-in “Burn Token” button, but it was removed. Today, the
        easiest way to burn SPL or LP tokens safely is through <strong>SolTokenBurner</strong>. This
        guide shows you how to do it step-by-step.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:fire" className="text-2xl" />
        Why Burn Tokens?
      </h2>

      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>Remove unwanted or spam tokens</li>
        <li>Burn LP tokens to lock liquidity</li>
        <li>Destroy supply intentionally for tokenomics</li>
        <li>Clean your wallet from dust or scam airdrops</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:rocket" className="text-2xl" />
        How to Burn Tokens Using Phantom (Step-by-Step)
      </h2>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-one-fill" className="text-xl" />
        Open SolTokenBurner
      </h3>
      <p className="mb-4">
        Visit{" "}
        <a
          href="https://www.soltokenburner.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 underline"
        >
          https://www.soltokenburner.com/
        </a>{" "}
        and connect your Phantom wallet on the top right.
      </p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-two-fill" className="text-xl" />
        Click REFRESH
      </h3>
      <p className="mb-4">This loads all SPL tokens + LP tokens in your wallet.</p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-three-fill" className="text-xl" />
        Select Token to Burn
      </h3>
      <p className="mb-4">Choose any SPL, LP, or spam token.</p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-four-fill" className="text-xl" />
        Choose Burn Amount
      </h3>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>
          <strong>Input Amount to Burn</strong> - burn partially
        </li>
        <li>
          <strong>MAX</strong> - auto-fill wallet's balance
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-five-fill" className="text-xl" />
        Approve in Phantom
      </h3>
      <p className="mb-6">Once approved, the tokens are permanently destroyed.</p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:warning" className="text-2xl" />
        NOTE
      </h2>

      <h3 className="text-xl font-semibold mb-3">Token Burning is Permanent</h3>
      <p className="mb-6">
        Double check the token and amount before burning as it cannot be reversed.
      </p>

      <p className="text-gray-400 mb-10 text-sm">Updated: December 2025</p>

      <BlogLinks />
    </div>
  );
}
