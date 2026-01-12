"use client";

import { showBottomBar } from "@/constants";
import { useState } from "react";

import BottomBar from "@/components/BottomBar";
import Footer from "@/components/Footer";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import Link from "next/link";

export default function NotFound() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen pb-[var(--mobile-bottom-bar-height)]">
      {/* ===== Top UI ===== */}
      <TopBar open={open} setOpen={setOpen} />
      {showBottomBar && <BottomBar open={open} />}
      <SideBar open={open} setOpen={setOpen} />

      {/* ===== Page Content ===== */}
      <div className="min-h-screen flex flex-col bg-[#0f0f10] text-white md:ml-64 font-inter">
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="max-w-md text-center bg-[#1c1c1e] border border-gray-800 rounded-xl p-8 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
            <h1 className="text-6xl font-bold text-purple-400 mb-4">404</h1>

            <p className="text-gray-400 mb-6">This page could not be found</p>

            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-md bg-[#8b5cf6] hover:bg-[#7c4ee8] transition font-semibold"
            >
              Homepage
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
