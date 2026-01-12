"use client";

import React, { useState } from "react";

import BottomBar from "@/components/BottomBar";
import FAQCreator from "@/components/FAQCreator";
import Footer from "@/components/Footer";
import MintLinkWithCopy from "@/components/MintLinkWithCopy";
import SideBar from "@/components/SideBar";
import ToastContainer from "@/components/ToastContainer";
import TopBar from "@/components/TopBar";
import PhantomPartnership from "@/components/phantomPartnership";
import axios from "axios";

import { hasEnoughSol } from "@/utils/SolanaHelpers";
import { Icon } from "@iconify/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Image, Loader2 } from "lucide-react";

import { showBottomBar, tokenCreationFee, tokenCreatorFeeWallet } from "@/constants";

import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import {
  AuthorityType,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

/* ------------------------------------
   PINATA CONFIG
--------------------------------------*/
const PINATA_API_KEY = "dc865844a27232765400";
const PINATA_SECRET_KEY = "5ef4f4b83051e96a3e8d8f71799a5496e0c0ccd39a01f5fc861fd84b98dc5ad8";
const PINATA_GATEWAY = "gray-keen-earwig-676.mypinata.cloud";
const IPFS_IO_GATEWAY = "ipfs.io";

/* ------------------------------------
 Toast Hook
--------------------------------------*/
type Toast = { id: number; type: "success" | "error" | "info"; text: string };
function useToasts(ttl = 5000) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = React.useRef(1);

  function push(type: Toast["type"], text: string) {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, ttl);
  }

  return { toasts, push };
}

/* ------------------------------------
 Main Page
--------------------------------------*/
export default function CreateTokenPage() {
  const wallet = useWallet();
  const { publicKey, sendTransaction, connected } = wallet;
  const { connection } = useConnection();

  const { toasts, push } = useToasts(4000);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const [description, setDescription] = useState("");

  const [decimals, setDecimals] = useState("6");
  const [supply, setSupply] = useState("1000000000"); // Default 1B

  const [revokeMint, setRevokeMint] = useState(true);
  const [revokeFreeze, setRevokeFreeze] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [statusHtml, setStatusHtml] = useState("");
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  /* ------------------------------------
     Image Upload
  --------------------------------------*/
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  }

  /* ------------------------------------
     Pinata Upload
  --------------------------------------*/
  async function uploadToPinata(file: File) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", fd, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    // return `https://${PINATA_GATEWAY}/ipfs/${res.data.IpfsHash}`;
    return `https://${IPFS_IO_GATEWAY}/ipfs/${res.data.IpfsHash}`;
  }

  async function uploadMetadataToPinata(json: any) {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetadata: { name: `${symbol}-${Date.now()}.json` },
        pinataContent: json,
      },
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      },
    );

    // return `https://${PINATA_GATEWAY}/ipfs/${res.data.IpfsHash}`;
    return `https://${IPFS_IO_GATEWAY}/ipfs/${res.data.IpfsHash}`;
  }

  /* ------------------------------------
     SUPPLY PRESET HELPER
  --------------------------------------*/
  const preset = Number(supply);
  const active = (v: number) =>
    preset === v ? "bg-[#7c4ee8] text-white" : "bg-[#141416] text-gray-400";

  /* ------------------------------------
     Create Token
  --------------------------------------*/
  async function handleCreateToken() {
    try {
      if (!publicKey) return push("error", "Wallet Not Connected");
      if (!connected) return push("error", "Connect Wallet First");

      if (!supply) return push("error", "Please Enter the Supply");
      if (!decimals) return push("error", "Please Enter the Decimal");

      //CHECK IF WALLET HAS ENOUGH BALANCE TO CREATE A TOKEN
      const solRequiredToCreateToken = 0.12;
      const hasEnoughBalance = await hasEnoughSol(connection, publicKey, solRequiredToCreateToken);
      if (!hasEnoughBalance) {
        return push("error", `You need at least ${solRequiredToCreateToken} SOL to Create a Token`);
      }

      const decimalsNum = Number(decimals);
      if (isNaN(decimalsNum) || decimalsNum < 0 || decimalsNum > 9)
        return push("error", "Decimals Must Be 0–9");

      if (!name && !symbol && !imageFile)
        return push("error", "Cannot Create Token with No Name, Symbol and Image");

      setCreating(true);

      if (!name) push("info", "Token will have No Name");
      if (!symbol) push("info", "Token will have No Symbol");

      /* ---- Upload Image ---- */
      let imgUrl = "";
      if (imageFile) {
        push("info", "Uploading Image to IPFS...");
        imgUrl = await uploadToPinata(imageFile);
        push("success", "Image Successfully Uploaded");
      } else push("info", "Token will have No Image");

      /* ---- Upload Metadata ---- */
      push("info", "Uploading Token Metadata to IPFS...");
      const metadataUrl = await uploadMetadataToPinata({
        name,
        symbol,
        description,
        image: imgUrl,
      });
      push("success", "Metadata Successfully Uploaded");

      /* ---- Create Mint ---- */
      push("info", "Minting New Token On-Chain...");
      const mint = Keypair.generate();
      const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      const tokenProgram = TOKEN_PROGRAM_ID;

      const ixMintAcct = SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: tokenProgram,
      });

      const ixInitMint = createInitializeMintInstruction(
        mint.publicKey,
        decimalsNum,
        publicKey,
        publicKey,
        tokenProgram,
      );

      const ata = await getAssociatedTokenAddress(mint.publicKey, publicKey, false, tokenProgram);

      const ixATA = createAssociatedTokenAccountInstruction(
        publicKey,
        ata,
        publicKey,
        mint.publicKey,
        tokenProgram,
      );

      const amount = BigInt(Number(supply) * 10 ** decimalsNum);

      const ixMintTo = createMintToInstruction(
        mint.publicKey,
        ata,
        publicKey,
        amount,
        [],
        tokenProgram,
      );

      /* ---- Metadata ---- */
      const [metadataPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()],
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
      );

      /* ---- Optional: Revoke Authorities ---- */
      const ixList: any[] = [ixMintAcct, ixInitMint, ixATA, ixMintTo, ixMetadata];

      if (revokeMint) {
        ixList.push(
          createSetAuthorityInstruction(
            mint.publicKey, // account whose authority is being changed
            publicKey, // current authority
            AuthorityType.MintTokens,
            null, // new authority = null
            [], // multisigners
            tokenProgram, // TOKEN_PROGRAM_ID
          ),
        );
      }

      if (revokeFreeze) {
        ixList.push(
          createSetAuthorityInstruction(
            mint.publicKey,
            publicKey,
            AuthorityType.FreezeAccount,
            null,
            [],
            tokenProgram,
          ),
        );
      }

      //REVOKE UPDATE AUTHORITY
      ixList.push(
        createUpdateMetadataAccountV2Instruction(
          {
            metadata: metadataPda,
            updateAuthority: publicKey,
          },
          {
            updateMetadataAccountArgsV2: {
              data: null, // don't change metadata
              updateAuthority: null, // REMOVE update authority
              primarySaleHappened: null,
              isMutable: null,
            },
          },
        ),
      );

      // FEE TRANSFER
      // if (Number(tokenCreationFee) != 0) {
      ixList.push(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: tokenCreatorFeeWallet,
          lamports: Math.floor(tokenCreationFee * LAMPORTS_PER_SOL),
        }),
      );
      // }

      /* ---- Send TX ---- */
      const tx = new Transaction().add(...ixList);
      const sig = await sendTransaction(tx, connection, {
        signers: [mint],
      });

      setMintAddress(mint.publicKey.toBase58());

      // setStatusHtml(`
      //   Mint: <a href="${explorerURL}/token/${mint.publicKey}"
      //            target="_blank"
      //            class="text-[#9d86ff]">${mint.publicKey}</a>
      // `);
      //   Tx: <a href="${explorerURL}/tx/${sig}"
      //    target="_blank"
      //    class="text-[#9d86ff]">${sig}</a>

      push("success", "Token Created!");
    } catch (err) {
      console.error(err);
      push("error", "Token Creation Failed");
    } finally {
      setCreating(false);
    }
  }

  /* ------------------------------------
     UI (Your original design)
  --------------------------------------*/
  return (
    <div
      className="
    min-h-screen
    pb-[var(--mobile-bottom-bar-height)]
  "
    >
      <TopBar account={publicKey?.toBase58()} open={open} setOpen={setOpen} />
      {showBottomBar && <BottomBar open={open} />}
      <SideBar open={open} setOpen={setOpen} />

      <div className="min-h-screen flex flex-col bg-[#0f0f10] text-white md:ml-64 pt-0 font-inter">
        <ToastContainer toasts={toasts} />

        <div className="flex-grow p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            {/* header */}
            <div className="bg-[#1c1c1e] rounded-xl p-4 mb-6 border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3">
                <Icon icon="token-branded:meme" className="w-10 h-10 " />

                <div>
                  <div className="text-xl font-semibold">Solana Token Creator</div>
                  <div className="text-xs text-gray-400">Create Solana SPL Tokens in One-Click</div>
                </div>
              </div>
            </div>

            {/* main form */}
            <div className="bg-[#1c1c1e] p-6 rounded-xl border border-gray-800 space-y-5">
              <div className="grid md:grid-cols-2 gap-3">
                {/* LEFT FORM SECTION */}
                <div className="space-y-2">
                  {/* Token Name */}
                  <div>
                    <label className="block text-xs mb-1 text-gray-300">Token Name</label>
                    <input
                      placeholder="dogwifhat"
                      className="w-full px-3 py-2 rounded bg-[#141416] border border-gray-700"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Symbol */}
                  <div>
                    <label className="block text-xs mb-1 text-gray-300">Symbol</label>
                    <input
                      placeholder="WIF"
                      className="w-full px-3 py-2 rounded bg-[#141416] border border-gray-700"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                    />
                  </div>

                  {/* Decimals */}
                  <div>
                    <label className="block text-xs mb-1 text-gray-300">Decimals</label>
                    <input
                      placeholder="6"
                      className="w-full px-3 py-2 rounded bg-[#141416] border border-gray-700"
                      value={decimals}
                      onChange={(e) => setDecimals(e.target.value)}
                    />
                  </div>

                  {/* Supply + Preset */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-gray-300">Supply</label>

                      <div className="flex gap-3 text-gray-400 text-xs">
                        {["1M", "1B", "1T"].map((label) => {
                          const v =
                            label === "1M"
                              ? "1000000"
                              : label === "1B"
                                ? "1000000000"
                                : "1000000000000";

                          const active = supply === v;

                          return (
                            <span
                              key={label}
                              onClick={() => setSupply(v)}
                              className={`cursor-pointer pb-0.5 ${
                                active
                                  ? "text-[#9d86ff] border-b border-[#9d86ff]"
                                  : "border-b border-transparent hover:border-gray-600"
                              }`}
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <input
                      placeholder="1000000000"
                      className="w-full px-3 py-2 rounded bg-[#141416] border border-gray-700"
                      value={supply}
                      onChange={(e) => setSupply(e.target.value)}
                    />
                  </div>
                </div>

                {/* RIGHT - TOKEN IMAGE */}
                <div className="flex flex-col items-center justify-center space-y-4 w-full">
                  {/* Centered Label */}

                  {/* Perfect Square Box */}
                  <label className="relative flex justify-center">
                    <div className="relative w-40 h-40 md:w-52 md:h-52 bg-[#141416] border border-gray-700 rounded-xl cursor-pointer hover:border-[#8b5cf6] overflow-hidden">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />

                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-xs text-gray-400">
                          <Image size={20} className="opacity-70" />
                          <span>Token Image</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* DESCRIPTION - FULL WIDTH UNDER BOTH COLUMNS */}
              <div>
                <label className="block text-xs mb-1 text-gray-300">Description</label>
                <input
                  placeholder="Dogwifhat vibes wif frens onchain."
                  className="w-full px-3 py-2 rounded bg-[#141416] border border-gray-700"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* CHECKBOX ROW - SIDE BY SIDE */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <label className="flex items-center gap-2 bg-[#141416] px-4 py-3 rounded-lg border border-gray-700 cursor-pointer hover:border-[#8b5cf6] flex-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={revokeMint}
                    onChange={(e) => setRevokeMint(e.target.checked)}
                  />
                  <span className="text-sm">Revoke Mint Authority</span>
                </label>

                <label className="flex items-center gap-2 bg-[#141416] px-4 py-3 rounded-lg border border-gray-700 cursor-pointer hover:border-[#8b5cf6] flex-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={revokeFreeze}
                    onChange={(e) => setRevokeFreeze(e.target.checked)}
                  />
                  <span className="text-sm">Revoke Freeze Authority</span>
                </label>
              </div>

              {/* CREATE BUTTON CENTERED */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleCreateToken}
                  disabled={creating}
                  className={`
                    group flex items-center justify-center gap-2
                    px-16 py-2 rounded text-white font-semibold
                    transition
                    ${
                      creating
                        ? "bg-[#3a2f56] cursor-not-allowed"
                        : "bg-[#8b5cf6] hover:bg-[#7c4ee8]"
                    }
                  `}
                >
                  {creating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating…
                    </>
                  ) : (
                    <>Create Token</>
                  )}
                </button>
              </div>

              {mintAddress && (
                <div className="mt-4 flex items-center gap-1 rounded-lg bg-[#141416] border-gray-900 px-3 py-2">
                  <span className="text-xs text-gray-400">Mint Address:</span>

                  <MintLinkWithCopy
                    mint={mintAddress}
                    linkClassName="text-[#9d86ff] hover:text-[#b49bff]"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center pt-10">
              <PhantomPartnership title="Create Solana SPL Tokens" />
            </div>

            <FAQCreator />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
