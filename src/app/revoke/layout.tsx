export const metadata = {
  title: "Revoke Mint & Freeze Authority | SolTokenBurner Authority Manager",
  description:
    "Permanently revoke mint authority or freeze authority for any SPL token on Solana. Secure, trustless, and on-chain.",
  keywords: [
    "renounce contract solana",
    "revoke mint authority solana",
    "revoke freeze authority solana",
    "solana token authority",
    "remove token mint authority",
    "lock token supply solana",
    "soltokenburner revoke authority",
  ],
  alternates: {
    canonical: "https://www.soltokenburner.com/revoke",
  },
  openGraph: {
    title: "Revoke Mint & Freeze Authority | SolTokenBurner Authority Manager",
    description:
      "Lock your token supply by revoking mint authority. Remove freeze authority for transparency.",
    url: "https://www.soltokenburner.com/revoke",
    siteName: "SolTokenBurner",
    images: [
      {
        url: "https://soltokenburner.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SolTokenBurner - Revoke Authority",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revoke Mint & Freeze Authority | SolTokenBurner Authority Manager",
    description:
      "Secure your token: revoke mint or freeze authority in one click using SolTokenBurner.",
    images: ["https://soltokenburner.com/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
