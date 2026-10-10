'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Header() {
  const pathname = usePathname();
  const { settings } = useStore();

  // Hide on all admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all">
      {/* Top Monochrome Announcement Bar */}
      <div className="bg-black text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-white" />
        <span>ผ่อนสินค้าแบรนด์เนมแท้ 100% เริ่มต้นหลักสิบบาท/วัน • อนุมัติไว ไม่เช็คบูโร • ส่งฟรีทั่วประเทศ</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black text-white font-black text-base flex items-center justify-center tracking-tight group-hover:bg-zinc-800 transition-colors">
              YP
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-black block uppercase">
                {settings.store_name || 'YOURPICKPAY'}
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase block">
                Catalog & Installment
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
