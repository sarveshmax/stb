import BlogLinks from "@/components/BlogLinks";
import Footer from "@/components/Footer";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "How to Send Tokens to a Dead Wallet on Solana | Burn SPL & LP Tokens (2025)",
  description:
    "Solana does not use dead wallet addresses like Ethereum. Learn how burning really works on Solana and follow a step-by-step guide to burn SPL & LP tokens correctly using SolTokenBurner.",
  alternates: {
    canonical: "https://www.soltokenburner.com/blog/dead-wallet-address-solana",
  },
  openGraph: {
    title: "How to Burn LP Tokens on Solana | Complete 2025 Guide",
    description:
      "Solana does not use dead wallet addresses like Ethereum. Learn how burning really works on Solana and follow a step-by-step guide to burn SPL & LP tokens correctly using SolTokenBurner.",
    url: "https://www.soltokenburner.com/blog/dead-wallet-address-solana",
    images: ["/og-image.png"],
  },
};

export default function DeadWalletBurnGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        How to Send Tokens to a Dead Wallet on Solana (And Why You Shouldn’t)
      </h1>

      <p className="mb-4">
        On Ethereum and similar chains, burning tokens is easy - you simply send them to a{" "}
        <strong>dead wallet address</strong> (0x000…dead). Once sent, the tokens are permanently
        gone from circulation.
      </p>

      <p className="mb-6">
        But Solana works differently. Many people search for the “dead wallet address on Solana,”
        but here’s the truth:
      </p>

      <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="noto:warning" className="text-xl" />
          <p className="text-lg font-semibold">Solana does NOT use dead wallet addresses.</p>
        </div>
        <p>
          You cannot burn tokens by sending them to an address. Solana requires an actual{" "}
          <strong>burn instruction</strong>.
        </p>
      </div>

      <p className="mb-6">
        So in this guide, we’ll explain why Solana works this way, and show you exactly how to burn
        SPL or LP tokens <strong>safely, correctly, and fully on-chain</strong> - even if you don’t
        know how to code.
      </p>

      {/* ------------------------------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:fire" className="text-2xl" />
        Why Solana Doesn’t Use Dead Wallets
      </h2>

      <p className="mb-4">
        Unlike Ethereum, Solana is built differently. Instead of sending tokens to a zero address,
        Solana requires tokens to be burned using the{" "}
        <strong>token program’s burn() function</strong>.
      </p>

      <p className="mb-6">
        If you send SPL tokens to a random wallet, even if nobody controls it, the tokens are{" "}
        <strong>not officially burned</strong>. They still exist in circulation - which means:
      </p>

      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li>They can still appear in supply trackers</li>
        <li>They are not considered destroyed</li>
        <li>Communities might not accept it as a true burn</li>
      </ul>

      <p>
        This is why Solana requires a real, verifiable, on-chain burn instruction that shows up
        clearly on Solscan.
      </p>

      {/* ------------------------------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:rocket" className="text-2xl" />
        Correct Way to Burn Tokens: Use SolTokenBurner
      </h2>

      <p className="mb-4">
        The easiest and safest way to burn SPL or LP tokens on Solana - without writing any code -
        is by using the <strong>SolTokenBurner dApp</strong>.
      </p>

      <p className="mb-6">
        It uses Solana's native <strong>burn()</strong> instruction and is the exact method
        developers use when burning supply transparently.
      </p>

      {/* ------------------------------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:compass" className="text-2xl" />
        Step-by-Step Guide to Burn SPL & LP Tokens
      </h2>

      <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-one-fill" className="text-xl" />
        Open SolTokenBurner & Connect Phantom
      </h3>

      <p className="mb-4">
        Visit{" "}
        <strong>
          <a
            href="https://www.soltokenburner.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 underline"
          >
            https://www.soltokenburner.com/
          </a>
        </strong>{" "}
        and click <strong>Select Wallet</strong> to connect Phantom (or any wallet).
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-two-fill" className="text-xl" />
        Select the Token You Want to Burn
      </h3>

      <p className="mb-4">Click “Refresh” and choose the token you want to burn. This can be:</p>

      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>Regular SPL Tokens</li>
        <li>Liquidity Pool Tokens from Raydium / Orca / Meteora</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-three-fill" className="text-xl" />
        Burn It
      </h3>

      <p className="mb-4">
        Choose "MAX" and Burn to burn the full supply in your wallet, or enter an amount and burn
        that amount specifically.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
        <Icon icon="ph:number-circle-four-fill" className="text-xl" />
        Verify the Burn on Solscan
      </h3>

      <p className="mb-4">
        Enter your wallet address on Solscan and check the latest transaction. Your burn will show
        up with a clear mark:
      </p>

      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li>
          <strong>Burn instruction</strong>
        </li>
        <li>Amount burned</li>
        <li>Token mint</li>
        <li>Signature transaction ID</li>
      </ul>

      <p>
        This is the <strong>only valid</strong> method for burning tokens on Solana.
      </p>

      {/* ------------------------------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="logos:youtube-icon" className="text-2xl" />
        Video Tutorial
      </h2>
      <p className="mb-6">A full video walkthrough is also available in the menu.</p>

      {/* ------------------------------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:pushpin" className="text-2xl" />
        Conclusion
      </h2>

      <p className="mb-5">
        Burning tokens on Solana is simpler than it seems - you just need to follow the correct
        method. Since Solana does not use dead wallet addresses, using a real burn instruction
        through a trusted dApp such as SolTokenBurner is the only true way to remove tokens
        permanently from circulation.
        <br />
        <br />
        Whether you're burning LP tokens, unwanted airdrops, or reducing project supply, this method
        ensures the burn is clean, transparent, and visible on Solscan.
      </p>

      <p className="text-gray-400 mb-10 text-sm">Updated: December 2025</p>

      <BlogLinks />
    </div>
  );
}
