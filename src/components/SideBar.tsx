"use client";

import Link from "next/link";

import { MoveUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

type MenuItem =
  | {
      name?: string;
      path?: string;
      external?: boolean;
      small?: boolean;
      type?: undefined;
    }
  | { type: "break" };

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

/* ===== LOCAL SVG ICON MAP ===== */
const ICONS: Record<string, { src: string; alt: string }> = {
  "/": { src: "/sidebaricons/burn.svg", alt: "Burner" },
  "/cleaner": { src: "/sidebaricons/wallet.svg", alt: "Cleaner" },
  "/stuck": { src: "/sidebaricons/stuck.svg", alt: "Stuck Tokens" },
  "/create": { src: "/sidebaricons/create.svg", alt: "Creator" },
  "/mint": { src: "/sidebaricons/mint.svg", alt: "Mint Tokens" },
  "/revoke": { src: "/sidebaricons/revoke.svg", alt: "Revoke Authority" },
  "/frozen": { src: "/sidebaricons/frozen.svg", alt: "Frozen Tokens" },
  "/blog": { src: "/sidebaricons/blog.svg", alt: "Blog" },
  "/blog/create-solana-token": {
    src: "/sidebaricons/guide.svg",
    alt: "Launch Guide",
  },

  /* === EXTERNAL LINKS === */
  "https://raydium.io/liquidity/create-pool/": {
    src: "/sidebaricons/lp.svg",
    alt: "Liquidity Pool",
  },
  "https://youtu.be/5Tg2vljl6n4": {
    src: "/sidebaricons/video.svg",
    alt: "Video Guide",
  },
  "https://old.soltokenburner.com/": {
    src: "/sidebaricons/old.svg",
    alt: "Old SolTokenBurner",
  },
};

/* ===== ICON COMPONENT ===== */
function SidebarIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={18}
      height={18}
      loading="eager"
      decoding="sync"
      className="w-[18px] h-[18px] object-contain"
    />
  );
}

export default function SideBar({ open, setOpen }: Props) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Token Burner", path: "/" },
    { name: "Cleaner (Claim SOL)", path: "/cleaner" },
    { name: "Burn Stuck Tokens", path: "/stuck" },

    { type: "break" },

    { name: "Token Creator", path: "/create" },
    { name: "Mint Tokens", path: "/mint" },
    { name: "Revoke Authority", path: "/revoke" },
    {
      name: "Create Liquidity Pool",
      path: "https://raydium.io/liquidity/create-pool/",
      external: true,
    },
    { name: "Launch Guide", path: "/blog/create-solana-token" },

    { type: "break" },

    { name: "Frozen Tokens", path: "/frozen" },

    { type: "break" },

    { name: "Blog", path: "/blog" },

    {
      name: "How SolTokenBurner Works",
      path: "/blog/how-soltokenburner-works",
      small: true,
    },
    {
      name: "How to Burn Tokens - Solana",
      path: "/blog/burn-solana-spl-lp-tokens",
      small: true,
    },
    {
      name: "How to Burn LP - Solana",
      path: "/blog/burn-lp-tokens-solana",
      small: true,
    },
    {
      name: "Solana Dead Wallet Address",
      path: "/blog/dead-wallet-address-solana",
      small: true,
    },
    {
      name: "DexScreener Padlock Tutorial",
      path: "/blog/dexscreener-padlock-liquidity-lock",
      small: true,
    },
    {
      name: "Burn Tokens Phantom",
      path: "/blog/burn-tokens-phantom",
      small: true,
    },
    {
      name: "Solana Burn Address",
      path: "/blog/solana-burn-address",
      small: true,
    },
    {
      name: "Why SolTokenBurner is the Best Burner",
      path: "/blog/sol-incinerator-alternative",
      small: true,
    },

    { type: "break" },

    {
      name: "Video Guide",
      path: "https://youtu.be/5Tg2vljl6n4",
      external: true,
    },
    {
      name: "Old SolTokenBurner",
      path: "https://old.soltokenburner.com/",
      external: true,
    },
  ];

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <div className="hidden md:block fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-[#1c1c1e] border-r border-gray-800 p-4 overflow-y-auto z-40">
        <SidebarMenu pathname={pathname} menuItems={menuItems} />
      </div>

      {/* ===== MOBILE SIDEBAR ===== */}
      <div
        className={`
          md:hidden fixed top-0 left-0 h-full w-64
          bg-[#1c1c1e] border-r border-gray-800
          transition-transform z-50 overflow-y-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 font-bold text-xl border-b border-gray-800">Menu</div>
        <div className="p-4">
          <SidebarMenu pathname={pathname} menuItems={menuItems} onClick={() => setOpen(false)} />
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      )}
    </>
  );
}

/* ===== MENU RENDERER ===== */

function SidebarMenu({
  pathname,
  menuItems,
  onClick,
}: {
  pathname: string;
  menuItems: MenuItem[];
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col space-y-1">
      {menuItems.map((item, i) => {
        if (item.type === "break") {
          return <div key={i} className="my-3 border-t border-gray-800" />;
        }

        const active = !item.external && pathname === item.path;

        const sizeClasses = item.small ? "text-sm px-3 py-2" : "text-base px-4 py-3";

        const classes = `
          rounded-md cursor-pointer transition
          ${sizeClasses}
          ${
            active
              ? "bg-[#2a2341] text-white font-semibold border border-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.4)]"
              : "text-gray-300 hover:text-white hover:bg-[#232325]"
          }
        `;

        const iconData = item.path ? ICONS[item.path] : null;

        const content = (
          <div className="flex items-center gap-3">
            {!item.small && iconData && (
              <span className={active ? "scale-110" : ""}>
                <SidebarIcon src={iconData.src} alt={iconData.alt} />
              </span>
            )}

            <span>{item.name}</span>

            {item.external && (
              <MoveUpRight
                size={14}
                strokeWidth={2}
                className="ml-auto opacity-60 group-hover:opacity-90 transition"
              />
            )}
          </div>
        );

        if (item.external) {
          return (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className={classes}
            >
              {content}
            </a>
          );
        }

        return (
          <Link key={item.path} href={item.path!}>
            <div className={classes} onClick={onClick}>
              {content}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
