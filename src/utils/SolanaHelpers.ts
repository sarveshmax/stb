import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function hasEnoughSol(
  connection: Connection,
  publicKey: PublicKey,
  minRequiredSol: number,
): Promise<boolean> {
  const balanceLamports = await connection.getBalance(publicKey);
  const balanceSol = balanceLamports / LAMPORTS_PER_SOL;

  return balanceSol >= minRequiredSol;
}

/**
 * Get wallet balance in SOL
 */
export async function getSolBalance(connection: Connection, pubkey: PublicKey): Promise<number> {
  const lamports = await connection.getBalance(pubkey, "confirmed");
  return lamports / LAMPORTS_PER_SOL;
}
