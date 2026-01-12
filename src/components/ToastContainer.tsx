"use client";

import { AnimatePresence, motion } from "framer-motion";

type Toast = { id: number; type: "success" | "error" | "info"; text: string };

export default function ToastContainer({
  toasts,
  offsetBottom = "1rem", // default: 16px (Tailwind bottom-4)
}: {
  toasts: Toast[];
  offsetBottom?: string;
}) {
  return (
    <div
      className="fixed right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none "
      style={{
        bottom: `calc(${offsetBottom} + var(--mobile-bottom-bar-height))`,
      }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            layout
            className="pointer-events-auto max-w-xs sm:max-w-sm md:max-w-md w-full"
          >
            <div
              className={`px-4 py-2 rounded shadow-lg text-sm flex items-center gap-3
                ${
                  t.type === "success"
                    ? "bg-green-600"
                    : t.type === "error"
                      ? "bg-red-600"
                      : "bg-indigo-600"
                }
                max-w-xs sm:max-w-sm md:max-w-md break-words whitespace-normal
              `}
            >
              {/* icon */}
              <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded text-xs flex-shrink-0">
                {t.type === "success" ? "✓" : t.type === "error" ? "!" : "i"}
              </span>

              {/* text */}
              <div className="leading-tight break-words whitespace-normal w-full">{t.text}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
