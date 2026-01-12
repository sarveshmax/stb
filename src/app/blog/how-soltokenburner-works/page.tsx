import BlogLinks from "@/components/BlogLinks";
import Footer from "@/components/Footer";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "How SolTokenBurner Works | Solana Token Burning Explained",
  description:
    "Learn how SolTokenBurner burns SPL tokens using Solana’s official burn instruction from @solana/spl-token. Technical explanation of how token burning works on-chain.",
  alternates: {
    canonical: "https://www.soltokenburner.com/blog/how-soltokenburner-works",
  },
  openGraph: {
    title: "How SolTokenBurner Works | Solana Token Burning Explained",
    description:
      "Learn how SolTokenBurner burns SPL tokens using Solana’s official burn instruction from @solana/spl-token. Technical explanation of how token burning works on-chain.",
    url: "https://www.soltokenburner.com/blog/how-soltokenburner-works",
    images: ["/og-image.png"],
  },
};

export default function HowSolTokenBurnerWorks() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">How SolTokenBurner Works (Technical Breakdown)</h1>

      <p className="mb-6">
        SolTokenBurner is the safest and simplest way to burn SPL tokens and LP tokens on Solana.
        Instead of using a custom smart contract, it relies entirely on Solana’s{" "}
        <strong>official burn instruction</strong> provided by <code>@solana/spl-token</code>.
      </p>

      <p className="mb-6">
        This guide explains exactly how burning works on Solana, how SolTokenBurner executes the
        burn, and why it is fully trustless.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:fire" className="text-2xl" />
        What Does It Mean to Burn a Token?
      </h2>

      <p className="mb-6">
        Burning a token means <strong>permanently reducing its total supply</strong>. On Solana,
        burning is done by sending a transaction that:
      </p>

      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>Removes tokens from your token account</li>
        <li>Reduces the token’s total supply on the mint</li>
        <li>Updates the mint authority–controlled supply counter</li>
      </ul>

      <p className="mb-6">
        Unlike Ethereum burn mechanisms, Solana does NOT send tokens to a dead wallet. Instead, it
        uses a <strong>native burn instruction</strong> that mathematically reduces supply.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:toolbox" className="text-2xl" />
        How SolTokenBurner Works Under the Hood
      </h2>

      <p className="mb-6">
        SolTokenBurner builds a burn transaction client-side using the official SPL Token library:
      </p>

      <pre className="bg-black p-4 rounded-xl text-xs sm:text-sm overflow-x-auto mb-6 max-w-full">
        <code className="whitespace-pre-wrap break-words">
          {`import { createBurnInstruction } from "@solana/spl-token";`}
        </code>
      </pre>

      <p className="mb-6">
        This means the app does not run custom programs (unlike other tools) - it uses Solana's
        standard token program (the same one used by Phantom, Raydium, Orca, and all wallets).
      </p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="fluent-color:checkmark-circle-48" className="text-xl" />
        Step 1: Load the User’s Token Accounts
      </h3>
      <p className="mb-6">
        When you click <strong>REFRESH</strong>, the app scans your wallet for all SPL & LP token
        accounts using public RPC calls.
      </p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="fluent-color:checkmark-circle-48" className="text-xl" />
        Step 2: Prepare a Burn Instruction
      </h3>
      <p className="mb-6">When you click “Burn”, the app constructs a burn instruction:</p>

      <pre className="bg-black p-4 rounded-xl text-xs sm:text-sm overflow-x-auto mb-6 max-w-full">
        <code className="whitespace-pre-wrap break-words">
          {`burn(
  connection,
  wallet,        // your Phantom wallet signs
  tokenAccount,  // your SPL token account
  mintAddress,   // token mint
  ownerPublicKey,
  amountToBurn   // user-chosen amount
);`}
        </code>
      </pre>

      <p className="mb-6">
        This creates a transaction but does not execute anything until you confirm it.
      </p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="fluent-color:checkmark-circle-48" className="text-xl" />
        Step 3: You Approve in Phantom
      </h3>
      <p className="mb-6">
        Phantom pops up and asks for approval. You sign the burn transaction locally on your device.
      </p>

      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Icon icon="fluent-color:checkmark-circle-48" className="text-xl" />
        Step 4: Solana’s Token Program Handles the Burn
      </h3>
      <p className="mb-6">When the transaction is sent, the official token program:</p>

      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>Burns the tokens from your account</li>
        <li>Reduces the mint's total supply</li>
        <li>Finalizes the transaction on-chain</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:shield" className="text-2xl" />
        Why SolTokenBurner Is Safe
      </h2>

      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>Uses only official Solana SPL Token Program instructions</li>
        <li>No custodial backend - everything is client-side</li>
        <li>Open-source token program ensures transparency</li>
        <li>Wallet transaction confirmation required for every action</li>
      </ul>

      <p className="mb-6">
        SolTokenBurner is only a front-end to perform the burn instruction you approve.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:magnifying-glass-tilted-right" className="text-2xl" />
        Verifying the Burn on Solscan
      </h2>

      <p className="mb-6">
        After burning, open Solscan → paste your wallet address → look for a transaction labeled{" "}
        <strong>"Burn"</strong>. This confirms the supply has been reduced permanently.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:pushpin" className="text-2xl" />
        Final Word
      </h2>

      <p className="mb-5">
        SolTokenBurner works by giving you a clean UI using Solana’s official burn instruction.
        Nothing custom, nothing risky - just the same safe burning mechanism used by wallets and
        DEXes across Solana.
      </p>

      <p className="text-gray-400 mb-10 text-sm">Updated: December 2025</p>

      <BlogLinks />
    </div>
  );
}
