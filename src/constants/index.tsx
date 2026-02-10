import { PublicKey } from "@solana/web3.js";

//BURN FEES + WALLET
export const burnFee = 0.00204;
export const burnFeeToken2022 = 0.00207;
export const cleanerBurnFee = 0.00003928;
export const cleanerBurnFee2022 = 0.00006908;
export const incineratorBurnFee = 0.1;
export const burnFeeWallet = new PublicKey(
  "7Nm526n8vEABUE669u1UWfBGx9CVk9UhFPX4NwT4HtaE", //BP-1
);

//TOKEN CREATOR FEES + WALLET
export const tokenCreationFee = 0.1;
export const tokenMintFee = 0.05;
export const tokenRevokeFee = 0.01;
export const tokenCreatorFeeWallet = new PublicKey(
  "2PZwKViUH2HBZRG5uK7j3zCU8mAjiJ4khMUmH2t68hZM", //BP-3
);

//API + RPC
const alchemyAPIKey = "l3vn7PSbFdRlZSD6uhdhk3fE8icnLKo5";
export const explorerURL = "https://solscan.io";
export const theRpcURL = `https://solana-mainnet.g.alchemy.com/v2/${alchemyAPIKey}`;

//UI
export const showPhantomPartnership = true;
export const showBottomBar = true;
