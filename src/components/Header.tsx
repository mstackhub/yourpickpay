'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, MessageCircle, Sparkles, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Header() {
  const pathname = usePathname();
  const { settings } = useStore();

  // Hide on all admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const lineUrl = settings.line_oa_url || 'https://line.me';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      {/* 1. Top Announcement Bar */}
      <div className="bg-zinc-950 text-white text-[11px] sm:text-xs py-2 px-4 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-zinc-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>สินค้าแบรนด์เนมของแท้ 100%</span>
          </span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="text-zinc-300">ผ่อนง่าย อนุมัติไว ไม่เช็คบูโร</span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="text-zinc-300">ส่งฟรีทั่วประเทศ</span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-950 text-white font-black text-sm sm:text-base flex items-center justify-center tracking-tight rounded-xl shadow-xs group-hover:scale-105 transition-all">
              YP
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-zinc-950 group-hover:text-black transition-colors font-sans uppercase">
                {settings.store_name || 'YOURPICKPAY'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold tracking-[0.18em] uppercase -mt-0.5">
                Luxury & Installment
              </span>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-black px-3.5 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>แคตตาล็อกสินค้า</span>
            </Link>

            {/* Line OA Quick Button */}
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>สอบถาม / เปิดสัญญา LINE</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
