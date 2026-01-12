import { KNOWN_TOKENS } from "@/constants/knownTokens";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

import {
  getMint,
  getTokenMetadata,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

/* =========================================================
   CONSTANTS 
========================================================= */

const RAYDIUM_AUTHORITIES = [
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"), //AUTHORITY_V4
  new PublicKey("GpMZbSM2GgvTKHJirzeGfMFoaZ8UR2X7F4v8vHTvxFbL"), //VAULT_VAUTHORITY_2
  new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"), //LIQUIDITY_POOL_V4
  new PublicKey("CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"), //CPMM
  new PublicKey("CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"), //CONCENTRATED_LIQUIDITY
  new PublicKey("routeUGWgWzqBWFcrCfv8tritsqukccJPu3q5GPP3xS"), //AMM_ROUTING
];

const METEORA_AUTHORITIES = [
  new PublicKey("cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"), //DAMM_V2
  new PublicKey("dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"), //DYNAMIC_BONDING_CURVE_PROGRAM
];

const PUMPSWAP_AMM_PROGRAM_ID = new PublicKey("pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA");

const ORCA_AMM_PROGRAM_ID = new PublicKey("whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc");

/* =========================================================
   HELPERS
========================================================= */

function normalizeIpfsUrl(uri?: string | null): string | null {
  if (!uri) return null;

  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`;
  }

  // Only normalize Pinata-hosted URLs
  if (!uri.toLowerCase().includes("pinata")) {
    return uri;
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

async function isRaydiumLP(mintAuthority?: PublicKey | null) {
  try {
    if (!mintAuthority) return false;
    return RAYDIUM_AUTHORITIES.some((authority) => authority.equals(mintAuthority));
  } catch {
    return false;
  }
}

async function isPumpFunLP(
  connection: any,
  programId: PublicKey,
  mintAuthority?: PublicKey | null,
) {
  try {
    if (!mintAuthority || programId !== TOKEN_2022_PROGRAM_ID) return false;
    const info = await connection.getAccountInfo(mintAuthority);
    return !!info && info.owner.equals(PUMPSWAP_AMM_PROGRAM_ID);
  } catch {
    return false;
  }
}

async function isOrcaLP(
  connection: any,
  programId: PublicKey,
  freezeAuthority?: PublicKey | null,
  isNFT?: boolean,
) {
  try {
    if (!isNFT || !freezeAuthority || programId !== TOKEN_2022_PROGRAM_ID) return false;
    const info = await connection.getAccountInfo(freezeAuthority);
    return !!info && info.owner.equals(ORCA_AMM_PROGRAM_ID);
  } catch {
    return false;
  }
}

/* =========================================================
   TOKEN-2022 METADATA
========================================================= */

async function getToken2022Metadata(connection: any, mintPubkey: PublicKey) {
  try {
    const md = await getTokenMetadata(connection, mintPubkey, "confirmed", TOKEN_2022_PROGRAM_ID);

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
  mintAuthority?: PublicKey | null,
  freezeAuthority?: PublicKey | null,
  isNFT: boolean = false,
) {
  const mintPubkey = new PublicKey(mintAddress);

  /* 0️⃣ Known tokens */
  if (KNOWN_TOKENS[mintAddress]) {
    return KNOWN_TOKENS[mintAddress];
  }

  /* 1️⃣ LP tokens FIRST */
  if (await isRaydiumLP(mintAuthority)) {
    return {
      name: "Raydium LP Token",
      symbol: "RAYDIUM LP",
      image: "/raydium.png",
    };
  }

  /* 3️⃣ Legacy SPL */
  if (programId.equals(TOKEN_PROGRAM_ID)) {
    const md = await getLegacyMetadata(connection, mintPubkey);
    const imageLink = normalizeIpfsUrl(md?.image);
    if (md?.name || md?.symbol) {
      return {
        name: md.name ?? "Unknown Token",
        symbol: md.symbol ?? "UNK",
        image: imageLink,
      };
    }
  }

  if (await isPumpFunLP(connection, programId, mintAuthority)) {
    return {
      name: "PUMP FUN LP Token",
      symbol: "PUMP FUN LP",
      image: "/pumpfun.jpg",
    };
  }
  if (await isOrcaLP(connection, programId, freezeAuthority, isNFT)) {
    return {
      name: "Orca Whirlpool Position",
      symbol: "OWP",
      image: "/whirlpool.png",
    };
  }

  /* 2️⃣ Token-2022 */
  if (programId.equals(TOKEN_2022_PROGRAM_ID)) {
    const md = await getToken2022Metadata(connection, mintPubkey);
    const imageLink = normalizeIpfsUrl(md?.image);
    if (md?.name || md?.symbol) {
      return {
        name: md.name ?? "Unknown Token",
        symbol: md.symbol ?? "UNK",
        image: imageLink,
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
