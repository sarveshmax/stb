"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <footer
      className="
        w-full mt-12
        bg-[#151517]
        border-t border-gray-800/70
        text-center
        py-3
        text-[11px]
        text-gray-400
      "
    >
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-2">
        <span>
          <span
            className="cursor-text select-none"
          >
            ©
          </span>{" "}
          {new Date().getFullYear()}{" "}
          <span className="text-white font-medium">SolTokenBurner.com</span> · Made with{" "}
          <span className="opacity-85">❤️</span> for Solana
          <span className="mx-1 opacity-40">·</span>
          <Link
            href="/terms"
            className="
              opacity-60 hover:opacity-100
              hover:underline underline-offset-4
              transition
            "
          >
            T&amp;C
          </Link>
        </span>

        {/* GitHub */}
        <Link
          href="https://github.com/kitkatcrypto/stb"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 opacity-50 hover:opacity-75 transition"
          aria-label="GitHub"
        >
          <Image
            src="/github.svg"
            alt="GitHub"
            width={14}
            height={14}
            className="invert"
          />
        </Link>
      </div>
    </footer>
  );
}
