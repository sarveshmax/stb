import BlogLinks from "@/components/BlogLinks";
import Footer from "@/components/Footer";
import MintLinkWithCopy from "@/components/MintLinkWithCopy";
import { Icon } from "@iconify/react";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata = {
  title: "Sol Incinerator Alternative | Burn SPL & LP Tokens Safely (2025)",
  description:
    "A detailed comparison between SolTokenBurner and Sol Incinerator. Learn the safest and most flexible way to burn SPL and LP tokens on Solana in 2025.",
  alternates: {
    canonical: "https://www.soltokenburner.com/blog/sol-incinerator-alternative",
  },
  openGraph: {
    title: "Sol Incinerator Alternative | Burn SPL & LP Tokens Safely (2025)",
    description:
      "A detailed comparison between SolTokenBurner and Sol Incinerator. Learn the safest and most flexible way to burn SPL and LP tokens on Solana in 2025.",
    url: "https://www.soltokenburner.com/blog/sol-incinerator-alternative",
    images: ["/og-image.png"],
  },
};

export default function SolIncineratorAlternative() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Sol Incinerator Alternative - The Safer & More Flexible Way to Burn SPL & LP Tokens
      </h1>

      <p className="mb-6">
        Sol Incinerator is a well-known tool in the Solana ecosystem, but its limitations -
        especially forcing full-balance burns and automatically closing token accounts - make it
        unsuitable for many users. Projects, developers, LP managers, and everyday holders often
        need a more flexible, controlled, and wallet-safe solution. There had also been reports of
        Sol Incinerator being unsafe.
      </p>

      <p className="mb-6">
        This page explains why <strong>SolTokenBurner</strong> has become the trusted alternative to
        Sol Incinerator, and how both tools differ in features, safety, and user flexibility.
      </p>

      {/* SECTION */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:magnifying-glass-tilted-right" className="text-2xl" />
        What Is Sol Incinerator?
      </h2>

      <p className="mb-4">
        Sol Incinerator was originally introduced as an app on Solana for burning SPL tokens. Its
        primary function is to burn the entire token balance and close the associated token
        accounts, returning the rent to the user while charging a service fee. However, this process
        executes multiple operations within a single program, which can be considered unsafe.
      </p>

      <p className="mb-6">
        Note that the burn function is not called on-chain directly (like on SolTokenBurner), but
        using their own custom program deployed on Solana. The program used by Sol Incinerator is{" "}
        <span className="inline-flex align-middle">
          <MintLinkWithCopy mint="F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7" type="account" />
        </span>{" "}
        and is not verified, meaning the on-chain code could contain arbitrary or potentially
        malicious logic. When checking the <strong>Verification</strong> tab for the program used by
        Sol Incinerator on Solscan, it displays <em>“On-chain program not verified”</em>, indicating
        that the source code has not been audited or publicly verified.
      </p>
      <p className="mb-4">
        It also lacks customization and is not ideal for more advanced token management actions -
        especially LP token burns or partial supply burns.
      </p>

      {/* SECTION */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:fire" className="text-2xl" />
        Why SolTokenBurner Is a Better Alternative
      </h2>

      <p className="mb-4">
        SolTokenBurner was created and it solves the limitations of Sol Incinerator and has been
        used across the ecosystem for years. SolTokenBurner has a much cleaner and user-friendly
        interface. The dApp allows wallet owners to burn SPL or LP tokens instantly with full
        control over the exact amount burned. Only one function <strong>burn()</strong> is executed.
      </p>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#111113]">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-[#141417]">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-400">Feature</th>
              <th className="px-6 py-4 text-left font-semibold text-white">SolTokenBurner</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Sol-Incinerator</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            <tr>
              <td className="px-6 py-4">Partial token burns</td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-[2px] text-green-400 shrink-0" />
                  <span>Yes</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-[2px] text-red-400 shrink-0" />
                  <span>No (full burn only)</span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4">User interface</td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-[2px] text-green-400 shrink-0" />
                  <span>Simple & Easy to Use</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-[2px] text-red-400 shrink-0" />
                  <span>Complex</span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4">LP token support</td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-[2px] text-green-400 shrink-0" />
                  <span>Supported</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-[2px] text-red-400 shrink-0" />
                  <span>Limited</span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4">Token account closure</td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-[2px] text-green-400 shrink-0" />
                  <span>Optional</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-[2px] text-red-400 shrink-0" />
                  <span>Required</span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4">Safety</td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-[2px] text-green-400 shrink-0" />
                  <span>Uses SPL Token program</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-[2px] text-red-400 shrink-0" />
                  <span>Custom on-chain program</span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4">Execution method</td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-[2px] text-green-400 shrink-0" />
                  <span>solana/spl-token's burn() instruction</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-[2px] text-red-400 shrink-0" />
                  <span>Proprietary code</span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4">Additional tools</td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-[2px] text-green-400 shrink-0" />
                  <span>Token creation & management</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-[2px] text-red-400 shrink-0" />
                  <span>None</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:light-bulb" className="text-2xl" />
        When Should You Use SolTokenBurner?
      </h2>

      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          You want to burn <strong>only a portion</strong> of your tokens
        </li>
        <li>
          You are burning <strong>LP tokens</strong>
        </li>
        <li>You want to burn, close token account and reclaim SOL rent</li>
        <li>You want full control over your token account</li>
        <li>You want a clean, simple interface with zero code</li>
        <li>You want to verify burns transparently on Solscan</li>
        <li>You want a long-standing, trusted dApp with stable performance</li>
      </ul>

      {/* SECTION */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:locked" className="text-2xl" />
        Are Burns Safe on SolTokenBurner?
      </h2>

      <p className="mb-6">
        Yes. All burns are executed directly through your connected wallet - Phantom, Backpack,
        Solflare, or others. No private keys, no server handling, and no third-party custody. Each
        burn is sent as a signed instruction from your wallet to the Solana blockchain, making it
        fully decentralized.
      </p>

      {/* FINAL */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Icon icon="noto:pushpin" className="text-2xl" />
        Final Word
      </h2>

      <p className="mb-5">
        Sol Incinerator remains a simple tool for basic full-balance burns with questionable
        legitimacy, but most users today require finer control - especially developers, LP managers,
        and community leaders performing public proof-of-burn transactions. SolTokenBurner provides
        that flexibility while maintaining complete on-chain transparency and wallet-level safety.
      </p>

      <p className="text-gray-400 mb-10 text-sm">Updated: December 2025</p>

      <BlogLinks />
    </div>
  );
}
