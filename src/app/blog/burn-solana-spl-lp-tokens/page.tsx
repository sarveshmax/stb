import BlogLinks from "@/components/BlogLinks";
import Footer from "@/components/Footer";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "How to Burn SPL & LP Tokens on Solana | Phantom Burn Guide 2025",
  description:
    "The most complete 2025 guide explaining how to burn SPL and LP tokens on Solana using Phantom Wallet through SolTokenBurner. No code required.",
  alternates: {
    canonical: "https://www.soltokenburner.com/blog/burn-solana-spl-lp-tokens",
  },
  openGraph: {
    title: "How to Burn LP Tokens on Solana | Complete 2025 Guide",
    description:
      "The most complete 2025 guide explaining how to burn SPL and LP tokens on Solana using Phantom Wallet through SolTokenBurner. No code required.",
    url: "https://www.soltokenburner.com/blog/burn-solana-spl-lp-tokens",
    images: ["/og-image.png"],
  },
};

export default function BurnSolanaGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        How to Burn SPL & LP Tokens on Solana (2025 Guide)
      </h1>

      <p className="mb-4">
        Burning tokens on Solana is a permanent on-chain action that reduces a token’s circulating
        supply. Whether you're a developer, liquidity provider, project owner, or simply someone
        holding unwanted SPL or LP tokens, burning them ensures that the tokens are permanently
        removed from circulation.
      </p>

      <p className="mb-4">
        This guide provides a complete, step-by-step explanation of how to burn tokens using Phantom
        Wallet (or any wallet) and the Solana Token Burner - a trusted OG dApp used since the early
        Solana days. The process is fast, decentralized, requires zero coding knowledge, and
        executes fully on-chain through your wallet.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:fire" className="text-2xl" />
        What Is Token Burning?
      </h2>

      <p className="mb-4">
        Token burning is the process of sending SPL tokens to a burn instruction that permanently
        removes them from the Solana supply. This is commonly used by:
      </p>

      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>Developers reducing token supply</li>
        <li>Projects burning remaining LP tokens</li>
        <li>Users removing spam tokens or unwanted airdrops</li>
        <li>Communities ensuring proof-of-burn transparency</li>
      </ul>

      <p className="mb-6">
        Because burning is irreversible, always confirm the token address and amount before
        approving the transaction.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:gear" className="text-2xl" />
        What You Need Before Burning
      </h2>

      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>A Phantom Wallet or any Solana-compatible wallet</li>
        <li>A small amount of SOL to pay the network fee</li>
        <li>You must own the SPL or LP tokens you want to burn</li>
      </ul>

      <p className="mb-6">
        SolTokenBurner works on both desktop and mobile versions of Phantom and executes each burn
        directly on the blockchain.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:rocket" className="text-2xl" />
        Step-by-Step: How to Burn Tokens Using Phantom
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
        • Open SolTokenBurner
      </h3>
      <p className="mb-4">
        Go to{" "}
        <strong>
          <a
            href="https://www.soltokenburner.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 underline"
          >
            https://www.soltokenburner.com/
          </a>
        </strong>
        . In the top-right corner, click <strong>Select Wallet</strong> and connect your wallet.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
        • Load Your Tokens
      </h3>
      <p className="mb-4">
        Click the <strong>REFRESH</strong> button. The app will scan your wallet and display all SPL
        and LP tokens associated with your address. If you hold many tokens, it may take a few
        seconds for all balances to appear.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
        • Choose How You Want to Burn
      </h3>

      <p className="mb-4">You have two options:</p>

      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>
          <strong>Max → Burn</strong> - removes the entire LP amount
        </li>
        <li>
          <strong>Input Amount → Burn</strong> - burns only a specific amount
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
        • Approve the Transaction in Phantom
      </h3>

      <p className="mb-4">
        Phantom will display the burn instruction details. Review the token and burn amount. Once
        you confirm, the burn is executed instantly and permanently on-chain.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:magnifying-glass-tilted-right" className="text-2xl" />
        How to Verify the Burn on Solscan
      </h2>

      <p className="mb-4">
        After burning, go to SolScan and paste your wallet address. Your latest transaction will
        show a clear burn instruction confirming:
      </p>

      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li>Token mint burned</li>
        <li>Amount burned</li>
        <li>Token account used</li>
        <li>Signature hash for blockchain verification</li>
      </ul>

      <p className="mb-4">
        This transaction link can be shared publicly for transparency, commonly used by developers
        and communities proving supply reduction.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:light-bulb" className="text-2xl" />
        Why Use Solana Token Burner?
      </h2>

      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>One of the earliest and most trusted token burn dApps on Solana</li>
        <li>100% no-code token burning</li>
        <li>Supports both SPL and LP tokens</li>
        <li>Burn any specific amount - not forced to burn the full balance</li>
        <li>Fully decentralized; all burns occur directly through your wallet</li>
        <li>Instant on-chain confirmation and verifiable records</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:pushpin" className="text-2xl" />
        Conclusion
      </h2>

      <p className="mb-5">
        Burning tokens on Solana is now easier and safer than ever. With the Sol Token Burner,
        anyone - even with zero development experience - can remove tokens from circulation, clean
        their wallet, or perform project-related burns with full transparency. All actions take
        place on-chain and are fully verifiable, making it the most reliable and community-trusted
        way to burn SPL or LP tokens.
      </p>

      <p className="text-gray-400 mb-10 text-sm">Updated: December 2025</p>

      <BlogLinks />
    </div>
  );
}
