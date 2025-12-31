"use client";

import TopBar from "@/components/TopBar";
import SideBar from "@/components/SideBar";
import Footer from "@/components/Footer";
import { useState } from "react";
import BottomBar from "@/components/BottomBar";
import { showBottomBar } from "@/constants";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
    min-h-screen
    pb-[var(--mobile-bottom-bar-height)]
  "
    >
      <TopBar open={open} setOpen={setOpen} />
      {showBottomBar && <BottomBar open={open} />}
      <SideBar open={open} setOpen={setOpen} />

      <div
        className="
          min-h-screen
          flex flex-col
          bg-[#0f0f10]
          text-white
          md:ml-64
          pt-0
          font-inter
        "
      >
        {/* BLOG CONTENT WRAPPER */}
        <div
          className="
            flex-grow
            px-5 sm:px-8 md:px-10
            max-w-4xl
            mx-auto
            text-gray-200
            leading-relaxed
          "
        >
          {children}
        </div>

        <Footer />
      </div>
    </div>
  );
}
