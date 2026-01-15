"use client";

import { useState } from "react";

import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

import MintLinkWithCopy from "@/components/MintLinkWithCopy";
import { Icon } from "@iconify/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Cpu,
  Layers,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function WhitepaperPage() {
  const { publicKey } = useWallet();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#f6f7f9]">
      <TopBar
        account={publicKey?.toBase58()}
        open={open}
        setOpen={setOpen}
        disableMenuIconMobile
        disableConnectWalletButton
      />

      <div className="min-h-screen flex flex-col text-gray-900 font-inter">
        <div className="flex-grow p-4 sm:p-8">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* HEADER */}
            <header className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Icon icon="mdi:file-document-outline" width={30} height={30} />
                <h1 className="text-3xl font-semibold tracking-tight">SolTokenBurner Whitepaper</h1>
              </div>

              <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
                This document describes the architecture, operation, and security model of
                SolTokenBurner. It is intended for users, wallet providers, and security reviewers.
              </p>

              <p className="mt-4 text-sm text-gray-400">Version 1.1 · January 2026</p>
            </header>

            <Section icon={<BookOpen size={18} />} title="Project Overview">
              <p>
                SolTokenBurner is a non-custodial, client-side utility designed to allow Solana
                users to permanently burn SPL tokens and reclaim rent from unused or empty token
                accounts in a transparent, auditable, and user-controlled manner. The tool addresses
                a common ecosystem problem where users accumulate zero-balance tokens, spam tokens,
                or spam NFTs that are difficult or inconvenient to manage through standard wallet
                interfaces.
              </p>

              <p>
                The primary goal of SolTokenBurner is to simplify these actions without introducing
                additional risk or abstraction. The application does not function as a protocol,
                does not deploy or interact with proprietary smart contracts, and does not introduce
                any custodial layer. Instead, it serves as a thin client that constructs standard
                Solana instructions and delegates full control of execution to the user’s wallet.
              </p>

              <p>
                All sensitive operations - including token burns and associated account closures -
                are initiated explicitly by the user and must be reviewed and approved within the
                connected wallet interface. SolTokenBurner does not have the ability to execute
                transactions independently, modify transaction parameters after user confirmation,
                or perform background or automated actions of any kind.
              </p>

              <p>
                The application has been live in production since 2023 and is actively used by
                thousands of Solana users. Over time, it has become part of a broader category of
                ecosystem utilities focused on account cleanup and asset management. Its design
                prioritizes clarity, minimalism, and predictability over feature complexity or
                automation.
              </p>

              <p>
                By intentionally limiting scope and avoiding custom on-chain logic, SolTokenBurner
                reduces attack surface and systemic risk. The project favors transparent
                documentation, observable on-chain behavior, and explicit user consent as its
                primary trust and security mechanisms rather than relying on opaque logic or
                off-chain execution.
              </p>
            </Section>

            <Section icon={<Cpu size={18} />} title="Technical Architecture">
              <p>
                SolTokenBurner is implemented as a pure client-side web application running entirely
                within the user’s browser environment. The system does not rely on a backend service
                for transaction construction, signing, or submission, and there is no privileged
                execution context capable of initiating on-chain actions independently.
              </p>

              <p>
                The application connects to the Solana network through public RPC endpoints and
                well-known third-party infrastructure providers. These connections are used
                exclusively to fetch read-only blockchain data, such as token accounts, balances,
                mint metadata, and associated account state.
              </p>

              <p>
                All transaction logic is generated deterministically at the moment the user requests
                an action. When a burn is initiated, SolTokenBurner constructs standard Solana
                instructions in real time, including the
                <code className="mx-1 px-1 bg-black/10 rounded">createBurnChecked</code>
                instruction from the official SPL Token Program and, where applicable, associated
                token account close instructions.
              </p>

              <p>
                These instructions are passed directly to the connected wallet without modification
                or abstraction. The wallet is responsible for presenting the full transaction
                details - including affected accounts, network fees, token amounts, and balance
                changes - to the user for review. SolTokenBurner has no ability to alter the
                transaction once it has been handed to the wallet.
              </p>

              <p>
                Importantly, the application does not deploy, invoke, or depend on any proprietary
                smart contracts or upgradeable on-chain programs. All interactions occur through
                well-established Solana system programs and the official SPL Token Program, which
                are widely used and extensively reviewed across the ecosystem.
              </p>

              <p>
                This architecture intentionally prioritizes transparency and predictability. By
                limiting all execution to explicit wallet-approved instructions and avoiding hidden
                or asynchronous behavior, SolTokenBurner minimizes both operational complexity and
                attack surface.
              </p>
            </Section>

            <Section icon={<Layers size={18} />} title="Operational Model">
              <p>
                SolTokenBurner follows a strictly user-driven operational flow. Every on-chain
                action is initiated explicitly by the user and must be approved by the connected
                wallet. There are no automated processes, scheduled tasks, or background executions
                performed by the application.
              </p>

              <p>
                The application provides two main utilities - a token burner and a token cleaner -
                both of which rely on standard Solana instructions and explicit wallet confirmation.
              </p>

              <p className="font-bold text-gray-900">Token Burner (Single-Token Burn)</p>

              <p>
                The token burner tool is designed to burn tokens one at a time. The user manually
                enters an amount to burn and then initiates the action. Upon user confirmation, the
                application constructs a single burn instruction using the official SPL Token
                Program:
              </p>

              <pre className="text-xs bg-black/5 p-3 rounded overflow-x-auto">
                {`createBurnCheckedInstruction(
  ata,        // token account
  mint,       // token mint
  publicKey,  // token owner
  rawAmount,  // amount to burn
  decimals,
  [],         // multisig (unused)
  programId,  // SPL Token Program
)`}
              </pre>

              <p>
                This instruction is generated in real time based on current on-chain state and
                passed directly to the connected wallet for review and approval.
              </p>

              <p className="font-bold text-gray-900">Cleaner Tool (Burn and Close Flow)</p>

              <p>
                The cleaner tool allows users to select multiple token accounts for cleanup. For
                each selected account, the application follows a deterministic and transparent
                process:
              </p>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  If the token account holds a non-zero balance, the remaining tokens are first
                  burned using the same
                  <code className="mx-1 px-1 bg-black/10 rounded">
                    createBurnCheckedInstruction
                  </code>
                  .
                </li>
                <li>
                  After the balance is reduced to zero, a
                  <code className="mx-1 px-1 bg-black/10 rounded">
                    createCloseAccountInstruction
                  </code>{" "}
                  is added to the same transaction to reclaim rent.
                </li>
              </ul>

              <pre className="text-xs bg-black/5 p-3 rounded overflow-x-auto">
                {`createCloseAccountInstruction(
  ata,        // token account
  publicKey,  // destination for reclaimed rent
  publicKey,  // authority
  [],         // multisig (unused)
  programId,  // SPL Token Program
)`}
              </pre>

              <p>
                Both instructions are included in a single transaction where applicable and
                submitted to the wallet as a complete instruction set. The wallet presents all
                affected accounts, balance changes, and fees before the user approves the
                transaction.
              </p>

              <p>
                If approved, the wallet signs the transaction and submits it to the Solana network.
                SolTokenBurner does not and cannot intercept, modify, or resubmit transactions after
                signing.
              </p>

              <hr className="my-6 border-t-2 border-black/10" />

              <p>
                In addition to the standard token burner and cleaner flows, SolTokenBurner provides
                a few other advanced utilities. All features follow the same core principles:
                deterministic behavior, standard Solana programs, and explicit wallet approval for
                every on-chain action.
              </p>

              {/* -------------------- BURN STUCK TOKENS -------------------- */}
              <p className="font-bold text-gray-900 mt-4">Burn Stuck Tokens (Incinerator Burn)</p>

              <p>
                Some token accounts become inaccessible when the original owner accidentally sends
                tokens to the Incinerator address{" "}
                <span className="inline-flex align-middle">
                  <MintLinkWithCopy
                    mint="1nc1nerator11111111111111111111111111111111"
                    type="account"
                  />
                </span>
                . SolTokenBurner supports burning these tokens to remove them permanently from
                circulation.
              </p>

              <p>
                Tokens can be burned from the Incinerator wallet because the token accounts are
                owned by a Program Derived Address (PDA), meaning no private key is associated with
                the address. Any user may construct and submit a burn instruction.
              </p>

              <p>The burn process uses the same standard SPL Token instruction:</p>

              <pre className="text-xs bg-black/5 p-3 rounded overflow-x-auto">
                {`createBurnCheckedInstruction(
  incineratorATA, // PDA-owned token account
  mint,           // token mint
  publicKey,      // signer (you)
  rawAmount,      // amount to burn
  decimals,
  [],
  programId,      // SPL Token Program
)`}
              </pre>

              <p>
                The transaction is submitted to the wallet as usual, confirming that the burn is
                executed on-chain using official instructions only.
              </p>

              {/* -------------------- CREATE TOKEN -------------------- */}
              <p className="font-bold text-gray-900 mt-6">Create Token (New Mint Initialization)</p>

              <p>
                SolTokenBurner allows users to create a brand-new SPL token from scratch. The
                application constructs all required instructions locally and submits them as a
                single transparent transaction.
              </p>

              <p>Metadata is created using the official Metaplex Token Metadata Program.</p>

              <pre className="text-xs bg-black/5 p-3 rounded overflow-x-auto">
                {`const mint = Keypair.generate();
const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

const tokenProgram = TOKEN_PROGRAM_ID;

// Create mint account
const ixMintAcct = SystemProgram.createAccount({
  fromPubkey: publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports,
  programId: tokenProgram,
});

// Initialize mint
const ixInitMint = createInitializeMintInstruction(
  mint.publicKey,
  decimalsNum,
  publicKey,
  publicKey,
  tokenProgram,
);

// Create associated token account
const ata = await getAssociatedTokenAddress(
  mint.publicKey,
  publicKey,
  false,
  tokenProgram,
);

const ixATA = createAssociatedTokenAccountInstruction(
  publicKey,
  ata,
  publicKey,
  mint.publicKey,
  tokenProgram,
);

// Mint initial supply
const amount = BigInt(Number(supply) * 10 ** decimalsNum);

const ixMintTo = createMintToInstruction(
  mint.publicKey,
  ata,
  publicKey,
  amount,
  [],
  tokenProgram,
);

const [metadataPda] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mint.publicKey.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID,
);

const ixMetadata = createCreateMetadataAccountV3Instruction(
  {
    metadata: metadataPda,
    mint: mint.publicKey,
    mintAuthority: publicKey,
    payer: publicKey,
    updateAuthority: publicKey,
  },
  {
    createMetadataAccountArgsV3: {
      data: {
        name,
        symbol,
        uri: metadataUrl,
        sellerFeeBasisPoints: 0,
        creators: null,
        uses: null,
        collection: null,
      },
      isMutable: true,
      collectionDetails: null,
    },
  },
);`}
              </pre>

              {/* -------------------- MINT MORE TOKENS -------------------- */}
              <p className="font-bold text-gray-900 mt-6">Mint Additional Tokens</p>

              <p>
                If the mint authority is retained, users can mint additional tokens to an associated
                token account using the standard SPL Token instruction.
              </p>

              <pre className="text-xs bg-black/5 p-3 rounded overflow-x-auto">
                {`createMintToInstruction(
  mintPK,
  ata,
  publicKey,
  mintRaw,
  [],
  programId,
)`}
              </pre>

              {/* -------------------- REVOKE AUTHORITY -------------------- */}
              <p className="font-bold text-gray-900 mt-6">Revoke Token Authorities</p>

              <p>
                To make a token trustless and immutable, SolTokenBurner allows users to revoke
                critical authorities. Once revoked, these actions cannot be undone.
              </p>

              <p className="underline text-gray-800">Revoke Freeze Authority</p>

              <pre className="text-xs bg-black/5 p-3 rounded overflow-x-auto">
                {`createSetAuthorityInstruction(
  mintPK,
  publicKey,
  AuthorityType.FreezeAccount,
  null,
  [],
  programId,
);`}
              </pre>

              <p className="underline text-gray-800 mt-4">Revoke Mint Authority</p>

              <pre className="text-xs bg-black/5 p-3 rounded overflow-x-auto">
                {`createSetAuthorityInstruction(
  mintPK,
  publicKey,
  AuthorityType.MintTokens,
  null,
  [],
  programId,
);`}
              </pre>

              <p className="mt-4">
                All authority changes are included as explicit instructions in a wallet-approved
                transaction, ensuring complete user control and on-chain verification.
              </p>

              <hr className="my-6 border-t-2 border-black/10" />

              <p>
                A small per-transaction service fee is included as part of the instruction set and
                transferred on-chain to a publicly visible address at{" "}
                <span className="inline-flex align-middle">
                  <MintLinkWithCopy
                    mint="7Nm526n8vEABUE669u1UWfBGx9CVk9UhFPX4NwT4HtaE"
                    // linkClassName="inline text-black hover:text-gray-600"
                    type="account"
                  />
                </span>
                , allowing anyone to independently verify fee collection and transaction history
                using standard blockchain explorers.
              </p>

              <p>
                This operational model ensures users retain full control, clear visibility, and
                deterministic behavior at every step of the process.
              </p>
            </Section>

            <Section icon={<ShieldCheck size={18} />} title="Security & Risk Mitigation">
              <p>
                SolTokenBurner is designed around a strict non-custodial security model. The
                application never requests private keys, seed phrases or recovery secrets, and never
                signs or submits transactions on behalf of users. All cryptographic signing is
                performed exclusively within the user’s chosen wallet environment.
              </p>

              <p>
                The scope of the application is intentionally limited to reduce attack surface.
                SolTokenBurner does not maintain user sessions, run background services, schedule
                automated transactions, or execute privileged code. All actions require direct user
                interaction and explicit wallet approval.
              </p>

              <p>
                On-chain interactions are constrained to well-established and widely used Solana
                programs, including the Solana System Program and the official SPL Token Program.
                The application does not deploy, invoke, or depend on any proprietary smart
                contracts, upgradeable logic, or opaque on-chain code paths.
              </p>

              <p>
                Because all critical execution occurs through wallet-confirmed transactions, users
                are presented with full transaction previews before any on-chain state changes
                occur. This includes affected accounts, token amounts, and balance changes.
                SolTokenBurner cannot suppress, alter, or bypass these wallet confirmations.
              </p>

              <p>
                Traditional smart-contract audits provide limited guarantees for applications whose
                logic resides entirely client-side. As such, SolTokenBurner emphasizes transparency,
                minimalism, and verifiability as its primary security controls. Any potentially
                malicious behavior would be immediately visible in the wallet’s transaction preview
                and on-chain transaction history.
              </p>

              <p>
                Additional risk considerations include token-specific behavior. Some SPL tokens may
                implement extensions, transfer hooks, or custom program logic that affect
                burnability or account closure. SolTokenBurner does not attempt to override or
                bypass such mechanisms and relies on the Solana runtime and wallet to enforce
                protocol rules.
              </p>

              <p>
                Overall security assurance is achieved through explicit user consent, reliance on
                mature Solana programs, public on-chain observability, and a deliberately narrow
                operational scope rather than through implicit trust or custodial controls.
              </p>
            </Section>

            {/* PRIVACY */}
            <Section icon={<Lock size={18} />} title="Privacy Policy">
              <p>SolTokenBurner does not collect, store, or process personal data of any kind.</p>

              <p>
                We do not store wallet addresses, IP addresses, device identifiers, or usage
                analytics.
              </p>

              <p>We do not use cookies, analytics, or tracking tools.</p>

              <p>
                All interactions occur directly between your wallet and the Solana blockchain. Token
                data is fetched in real time from public RPC endpoints or third-party APIs.
              </p>
            </Section>

            <Section icon={<Users size={18} />} title="Maintenance & Responsibility">
              <p>
                SolTokenBurner is maintained by an independent developer operating under{" "}
                <strong>KitKat</strong>. The project is not operated by a company or custodial
                entity and does not involve administrative control over user funds or on-chain
                state.
              </p>

              <p>
                Maintenance includes ensuring compatibility with Solana and SPL Token updates,
                addressing bugs, and keeping public documentation accurate and up to date.
              </p>

              <p>
                While the maintainer operates pseudonymously, accountability is provided through
                transparency, explicit wallet approvals, and publicly verifiable on-chain behavior.
              </p>
            </Section>

            <Section icon={<AlertTriangle size={18} />} title="Limitations & Disclaimer">
              <p>
                Token behavior may vary due to custom programs, SPL extensions, transfer hooks, or
                protocol-level restrictions. As a result, some tokens may be non-burnable or behave
                differently than expected.
              </p>

              <p>
                SolTokenBurner is provided on an “as is” and “as available” basis. The application
                does not provide financial, legal, or investment advice, and users remain fully
                responsible for all transactions they approve.
              </p>
            </Section>
          </div>
        </div>

        {/* BACK TO APP */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="
                inline-flex items-center gap-2
                rounded-lg
                border border-violet-500
                bg-violet-500
                px-6 py-3
                text-sm font-medium text-white
                shadow-sm
                hover:bg-violet-600 hover:border-violet-600
                transition
                "
          >
            <ArrowLeft size={16} />
            Back to SolTokenBurner
          </Link>
        </div>

        <Footer />
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable Whitepaper Section         */
/* ---------------------------------- */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
        {icon}
        {title}
      </h2>

      <div className="text-base text-gray-700 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
