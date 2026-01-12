"use client";

import { Icon } from "@iconify/react";

export default function BlogGuidePage() {
  return (
    <div className="min-h-screen text-white font-inter px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#8b5cf6] to-[#c084fc] text-transparent bg-clip-text">
            Token Creation & Liquidity Guide
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            A complete walkthrough to help you create your SPL token, add liquidity, and launch your
            project successfully.
          </p>
        </header>

        {/* Divider */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#3a2f56] to-transparent" />

        {/* SECTION 1 */}
        <section className="bg-[#141416] p-8 rounded-2xl border border-gray-800 shadow-lg shadow-black/30 space-y-6">
          <h2 className="text-3xl font-bold tracking-wide flex items-center gap-2">
            <Icon icon="noto:hammer-and-wrench" className="text-3xl" />
            Create Your Token
          </h2>

          <a
            href="https://www.soltokenburner.com/create"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-[#8b5cf6] to-[#7c4ee8] hover:opacity-90 rounded-xl font-semibold transition-all"
          >
            Token Creator
          </a>

          <ul className="list-disc pl-6 space-y-4 text-lg text-gray-300 leading-relaxed">
            <li>Enter your token name and symbol.</li>
            <li>Upload your token image (recommended square format).</li>
            <li>Set total supply and decimals based on your tokenomics.</li>
            <li>
              Ensure <span className="text-[#c084fc] font-semibold">Mint Authority</span> is
              revoked.
            </li>
            <li>
              Ensure <span className="text-[#c084fc] font-semibold">Freeze Authority</span> is
              revoked.
            </li>
            <li>
              Click <b>Create Token</b> to deploy your token on Solana.
            </li>
          </ul>

          <div className="p-4 bg-[#1c1c22] border border-[#2a2a2f] rounded-xl text-gray-300 text-base leading-relaxed flex items-start gap-2">
            <Icon icon="noto:light-bulb" className="text-xl mt-[2px]" />
            <span>
              <span className="text-[#c084fc] font-semibold">Tip:</span> The standard tokenomics
              used are 1 billion tokens and 6 decimals.
            </span>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="bg-[#141416] p-8 rounded-2xl border border-gray-800 shadow-lg shadow-black/30 space-y-6">
          <h2 className="text-3xl font-bold tracking-wide flex items-center gap-2">
            <Icon icon="noto:droplet" className="text-3xl" />
            Add Liquidity on Raydium
          </h2>

          <a
            href="https://www.soltokenburner.com/create"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-[#8b5cf6] to-[#7c4ee8] hover:opacity-90 rounded-xl font-semibold transition-all"
          >
            Create Liquidity Pool
          </a>

          <ul className="list-disc pl-6 space-y-4 text-lg text-gray-300 leading-relaxed">
            <li>Go to Raydium's Create Pool website (link above).</li>
            <li>
              Select your new SPL token as the <b>Base Token</b>.
            </li>
            <li>
              Select SOL as the <b>Quote Token</b>.
            </li>
            <li>
              Enter the number of tokens to pair -
              <span className="text-[#c084fc] font-semibold"> recommended: 10% of supply</span>.
            </li>
            <li>Choose how much SOL you want to put into the pool.</li>
            <li>
              Use the default fee tier of <b>0.25%</b> unless needed otherwise.
            </li>
            <li>
              Set the start time:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <b>Start Now</b> - trading begins immediately
                </li>
                <li>
                  <b>Custom Date/Time</b> - schedule the launch
                </li>
              </ul>
            </li>
          </ul>

          <div className="p-4 bg-[#1c1c22] border border-[#2a2a2f] rounded-xl text-gray-300 text-base leading-relaxed space-y-2">
            <div className="flex items-start gap-2">
              <Icon icon="noto:light-bulb" className="text-xl mt-[2px]" />
              <span>
                <span className="text-[#c084fc] font-semibold">Tip:</span> You can burn LP tokens
                even before going live if you select a future time.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Icon icon="noto:pushpin" className="text-xl mt-[2px]" />
              <span>
                <span className="text-[#c084fc] font-semibold">Note:</span> Freeze Authority must be
                revoked to create a liquidity pool.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="bg-[#141416] p-8 rounded-2xl border border-gray-800 shadow-lg shadow-black/30 space-y-6">
          <h2 className="text-3xl font-bold tracking-wide flex items-center gap-2">
            <Icon icon="noto:fire" className="text-3xl" />
            Burn LP Tokens (Liquidity Lock)
          </h2>

          <a
            href="https://www.soltokenburner.com/create"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-[#8b5cf6] to-[#7c4ee8] hover:opacity-90 rounded-xl font-semibold transition-all"
          >
            Token Burner
          </a>

          <p className="text-lg text-gray-300 leading-relaxed">
            Once you provide liquidity, you receive LP tokens. Burning these permanently locks
            liquidity and builds trust with buyers.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed">
            Visit{" "}
            <a
              href="https://www.soltokenburner.com"
              target="_blank"
              className="text-[#c084fc] hover:text-[#b49bff]"
            >
              the main SolTokenBurner page
            </a>
            , locate your LP token, and burn it fully or partially.
          </p>

          <div className="p-4 bg-[#1c1c22] border border-[#2a2a2f] rounded-xl text-base text-gray-300 leading-relaxed flex items-start gap-2">
            <Icon icon="noto:locked" className="text-xl mt-[2px]" />
            Dexscreener will automatically show the liquidity-lock padlock within 10 minutes after
            LP is burned.
          </div>
        </section>

        {/* SECTION 4 */}
        <section className="bg-[#141416] p-8 rounded-2xl border border-gray-800 shadow-lg shadow-black/30 space-y-6">
          <h2 className="text-3xl font-bold tracking-wide flex items-center gap-2">
            <Icon icon="fluent-color:checkmark-circle-48" className="text-3xl" />
            Final Steps After Launch
          </h2>

          <ul className="list-disc pl-6 space-y-4 text-lg text-gray-300 leading-relaxed">
            <li>Hold necessary tokens for your project operations.</li>
            <li>Send allocations to team members, airdrops, and other wallets.</li>
            <li>Burn the remaining supply.</li>
          </ul>
        </section>

        {/* SECTION 5 */}
        <section className="bg-[#141416] p-8 rounded-2xl border border-gray-800 shadow-lg shadow-black/30 space-y-5">
          <h2 className="text-3xl font-bold tracking-wide flex items-center gap-2">
            <Icon icon="noto:link" className="text-3xl" />
            Useful Links
          </h2>

          <ul className="space-y-3 text-lg text-gray-300 leading-relaxed">
            <li>
              Video Tutorial on How to Create a Solana Token
              <br />
              <a
                href="https://youtu.be/ZeLXAzj8eo4"
                target="_blank"
                className="text-[#c084fc] hover:text-[#b49bff]"
              >
                YouTube
              </a>
            </li>

            <li>
              Dexscreener & Dextools Socials Update
              <br />
              <a
                href="https://marketplace.dexscreener.com/product/token-info"
                target="_blank"
                className="text-[#c084fc] hover:text-[#b49bff]"
              >
                DexScreener Enhanced Token Info ($299)
              </a>
              <br />
              <a
                href="https://www.dextools.io/marketplace/en/create-socials"
                target="_blank"
                className="text-[#c084fc] hover:text-[#b49bff]"
              >
                Dextools Token Info & Socials Update ($295)
              </a>
            </li>

            <li>
              Create a Website for Your Token
              <br />
              <a
                href="https://www.wix.com"
                target="_blank"
                className="text-[#c084fc] hover:text-[#b49bff]"
              >
                Wix
              </a>
            </li>

            <li>
              Telegram Bots for Community Management
              <br />
              <a
                href="https://www.t.me/delugebuybot"
                target="_blank"
                className="text-[#c084fc] hover:text-[#b49bff]"
              >
                Deluge Buy Bot
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
