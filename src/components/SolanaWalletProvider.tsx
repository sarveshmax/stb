"use client";

import "@solana/wallet-adapter-react-ui/styles.css";
import React from "react";

import { theRpcURL } from "@/constants";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

export default function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = theRpcURL;

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({
      network: WalletAdapterNetwork.Mainnet,
    }),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
