"use client";

interface PhantomPartnershipProps {
  title: string;
}

export default function PhantomPartnership({ title }: PhantomPartnershipProps) {
  return (
    <div className="w-115 flex items-center gap-4 rounded-2xl mt-2 mb-2 p-4 bg-gradient-to-r from-purple-600/20 to-green-500/20 border border-white/20 backdrop-blur-md">
      {/* PHANTOM LOGO */}
      <img src="/phantomlogo.png" alt="Phantom Logo" className="w-7 h-7" />

      {/* TEXT */}
      <p className="text-left text-sm font-medium text-white leading-relaxed">
        <span className="font-bold underline underline-offset-2">{title}</span>
        <br />
        SolTokenBurner is now listed in Phantom Apps.
        <br />
        <a
          href="https://phantom.com/apps/soltokenburner"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-xs text-[#14F195] hover:text-white transition break-all"
        >
          https://phantom.com/apps/soltokenburner
        </a>
      </p>
    </div>
  );
}
