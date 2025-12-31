"use client";

export default function Footer() {
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
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
        <span>
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-medium">SolTokenBurner.com</span> ·
          Made with <span className="opacity-85">❤️</span> for Solana
        </span>
      </div>
    </footer>
  );
}
