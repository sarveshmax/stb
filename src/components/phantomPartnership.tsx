"use client";

interface PhantomPartnershipProps {
  title: string;
}

export default function PhantomPartnership({ title }: PhantomPartnershipProps) {
  return (
    <div className="mt-6 flex flex-col items-center text-center select-none">
      {/* Label */}
      <span className="mb-4 text-[10px] uppercase tracking-widest text-white/40 leading-none ">
        Listed on
      </span>

      {/* Logos */}
      <div className="flex items-center justify-center gap-3">
        {/* Phantom */}
        <a
          href="https://phantom.com/apps/soltokenburner"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-60 hover:opacity-80 transition"
        >
          <img src="/walleticons/phantomfull.png" alt="Phantom" className="h-4" />
        </a>

        {/* Backpack */}
        <a
          href="https://learn.backpack.exchange/articles/solana-burn-address-explained#:~:text=SolTokenBurner.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-60 hover:opacity-80 transition"
        >
          <img src="/walleticons/backpackfull.png" alt="Backpack" className="h-4" />
        </a>
      </div>
    </div>
  );
}
