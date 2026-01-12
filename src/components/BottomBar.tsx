"use client";

import Link from "next/link";

import { BookText, Flame, Hammer, Lock, Sprout, Wallet2Icon } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  open: boolean;
}

export default function BottomBar({ open }: Props) {
  const pathname = usePathname();
  if (open) return null;

  const tabs = [
    { href: "/", label: "Burn", icon: Flame },
    { href: "/cleaner", label: "Clean", icon: Wallet2Icon },
    { href: "/create", label: "Create", icon: Hammer },
    { href: "/mint", label: "Mint", icon: Sprout },
    { href: "/revoke", label: "Revoke", icon: Lock },
    { href: "/blog", label: "Blog", icon: BookText },
  ];

  return (
    <div
      className="
        fixed bottom-0 left-0 w-full
        h-14
        bg-[#121214]/95
        backdrop-blur-xl
        border-t border-gray-800
        flex
        md:hidden z-[60]
      "
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="
              flex-1 h-full
              flex items-center justify-center
            "
          >
            <div className="flex flex-col items-center justify-center mt-[2px]">
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.8}
                className={`
                  transition-transform duration-200
                  ${active ? "text-[#6d5bd6] scale-105" : "text-gray-400"}
                `}
              />

              <span
                className={`
                  text-[11px] mt-1 tracking-wide
                  transition-colors duration-200
                  ${active ? "text-[#6d5bd6] font-semibold" : "text-gray-400"}
                `}
              >
                {tab.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
