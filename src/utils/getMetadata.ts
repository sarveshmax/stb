import {
  getMint,
  getTokenMetadata,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { KNOWN_TOKENS } from "@/constants/knownTokens";

/* =========================================================
   CONSTANTS
========================================================= */

// Raydium LP Mint Authorities
const RAYDIUM_AMM_PROGRAM_ID = new PublicKey(
  "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
);
const RAYDIUM_VAULT_2 = new PublicKey(
  "GpMZbSM2GgvTKHJirzeGfMFoaZ8UR2X7F4v8vHTvxFbL",
);

// Pump.fun / PumpSwap
const PUMPSWAP_AMM_PROGRAM_ID = new PublicKey(
  "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
);

/* =========================================================
   HELPERS
========================================================= */

function normalizeIpfsUrl(uri?: string | null): string | null {
  if (!uri) return null;

  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`;
  }

  const match = uri.match(/\/ipfs\/([^/?#]+)/);
  if (match) {
    return `https://ipfs.io/ipfs/${match[1]}`;
  }

  return uri;
}

/* =========================================================
   MINT CLASSIFICATION
========================================================= */

async function classifyMint(connection: any, mintAddress: string) {
  const mint = await getMint(connection, new PublicKey(mintAddress));

  const isNFT = mint.supply === 1n && mint.decimals === 0;

  return {
    isNFT,
    isFungible: !isNFT,
    supply: mint.supply,
    decimals: mint.decimals,
  };
}

/* =========================================================
   LP DETECTION (ON-CHAIN)
========================================================= */

async function isRaydiumLP(connection: any, mintAddress: string) {
  try {
    const mintInfo = await getMint(connection, new PublicKey(mintAddress));

    return (
      (mintInfo.mintAuthority &&
        mintInfo.mintAuthority.equals(RAYDIUM_AMM_PROGRAM_ID)) ||
      (mintInfo.mintAuthority && mintInfo.mintAuthority.equals(RAYDIUM_VAULT_2))
    );
  } catch {
    return false;
  }
}

async function isPumpFunLP(connection: any, mintAddress: string) {
  try {
    const mintInfo = await getMint(connection, new PublicKey(mintAddress));
    const authority = mintInfo.mintAuthority;

    if (!authority) return false;

    const info = await connection.getAccountInfo(authority);
    return !!info && info.owner.equals(PUMPSWAP_AMM_PROGRAM_ID);
  } catch {
    return false;
  }
}

/* =========================================================
   TOKEN-2022 METADATA
========================================================= */

async function getToken2022Metadata(connection: any, mintPubkey: PublicKey) {
  try {
    const md = await getTokenMetadata(
      connection,
      mintPubkey,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );

    if (!md) return null;

    let image: string | null = null;

    if (md.uri) {
      try {
        const uri = normalizeIpfsUrl(md.uri);
        if (uri) {
          const resp = await fetch(uri);
          const j = await resp.json();
          image = j.image ?? null;
        }
      } catch {}
    }

    return {
      name: md.name ?? null,
      symbol: md.symbol ?? null,
      image,
    };
  } catch {
    return null;
  }
}

/* =========================================================
   LEGACY SPL METAPLEX METADATA
========================================================= */

async function getLegacyMetadata(connection: any, mintPubkey: PublicKey) {
  try {
    const metaplex = new Metaplex(connection);
    const meta = await metaplex.nfts().findByMint({ mintAddress: mintPubkey });

    if (!meta) return null;

    let image: string | null = null;

    if (meta.uri) {
      try {
        const uri = normalizeIpfsUrl(meta.uri);
        if (uri) {
          const resp = await fetch(uri);
          const j = await resp.json();
          image = j.image ?? null;
        }
      } catch {}
    }

    return {
      name: meta.name ?? null,
      symbol: meta.symbol ?? null,
      image,
    };
  } catch {
    return null;
  }
}

/* =========================================================
   UNIFIED METADATA FETCHER (FINAL)
========================================================= */

export async function getAnyTokenMetadata(
  connection: any,
  mintAddress: string,
  programId: PublicKey,
) {
  const mintPubkey = new PublicKey(mintAddress);

  /* 0️⃣ Known tokens */
  if (KNOWN_TOKENS[mintAddress]) {
    return KNOWN_TOKENS[mintAddress];
  }

  /* 1️⃣ LP tokens FIRST */
  if (await isRaydiumLP(connection, mintAddress)) {
    return {
      name: "Raydium LP Token",
      symbol: "RAYDIUM LP",
      image: "/raydium.png",
    };
  }

  /* 2️⃣ Token-2022 */
  if (programId.equals(TOKEN_2022_PROGRAM_ID)) {
    const md = await getToken2022Metadata(connection, mintPubkey);
    if (md?.name || md?.symbol) {
      return {
        name: md.name ?? "Unknown Token",
        symbol: md.symbol ?? "UNK",
        image: md.image ?? null,
      };
    }
  }

  /* 3️⃣ Legacy SPL */
  if (programId.equals(TOKEN_PROGRAM_ID)) {
    const md = await getLegacyMetadata(connection, mintPubkey);
    if (md?.name || md?.symbol) {
      return {
        name: md.name ?? "Unknown Token",
        symbol: md.symbol ?? "UNK",
        image: md.image ?? null,
      };
    }
  }

  /* 4️⃣ Mint-based fallback */
  try {
    const cls = await classifyMint(connection, mintAddress);

    if (cls.isNFT) {
      return {
        name: "Unknown NFT",
        symbol: "NFT",
        image: null,
      };
    }
  } catch {}

  /* 5️⃣ Final fallback */
  return {
    name: "Unknown Token",
    symbol: "UNK",
    image: null,
  };
}
