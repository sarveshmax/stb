// ===== 💰 STABLECOINS CONTRACT ADDRESS =====
const USDC_CA = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; //circle
const USDT_CA = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; //tether
const PYUSD_CA = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo"; //paypal
const USDG_CA = "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH"; //global
const USD1_CA = "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB"; //world liberty
export const STABLECOINS_CA = [USDC_CA, USDT_CA, PYUSD_CA, USDG_CA, USD1_CA];

// ===== 🔥 TOKEN BURNER =====
export const TOKENS_TO_IGNORE_WHEN_BURNING = [
  "2g3tpvK5wou1T4PcUHPyenRfKHBm9W7fiYVDjW2okMtz", //TIPEO
  "4ZiVmCdCNyrHvWwWBDA5FjrKMQPfMTnmQ7fcEW6B2nqC", //HYPRL
  "FqdKuFwKgxTfhk9DAfuygPVKwYzUfKdBRW9ZJ5vkuthv", //810
  "G7buPx4K3cjKW27zsraZEFtiMDDkjJCpSrLQC9EVdsLb", //LISA
];

// ===== 💵 TOKEN CLEANER =====
export const TOKENS_TO_SHOW_WHEN_CLEANING = [
  USDG_CA, //GLOBAL USD
  PYUSD_CA, //PAYPAL USD
  "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn", //PUMP
];

export const IGNORE_IN_CLEANER = [
  "MLP", //Meteora LP
  "RCL", //Raydium Concentrated Liquidity
  "RAYDIUM LP",
  "PUMP FUN LP",
];
