'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, CreditCard, Truck } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Footer() {
  const pathname = usePathname();
  const { settings, categories } = useStore();

  // Hide on all admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-black text-white border-t border-zinc-900 mt-24">
      {/* 3 Value Pillars - Minimalist Luxury Grid */}
      <div className="border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
            
            {/* Pillar 1 */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:pr-6">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                  การันตีของแท้ 100%
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  นำเข้าจากเคาน์เตอร์แบรนด์ เช็คโค้ดได้ทุกชิ้น ยินดีคืนเงินเต็มจำนวนหากพบว่าปลอม
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-4 pt-6 md:pt-0 md:px-6">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                  ผ่อนง่าย อนุมัติไว
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  เลือกผ่อนได้ตามใจ ทั้งรายวัน รายสัปดาห์ หรือรายเดือน ไม่เช็คบูโร ทุกอาชีพผ่อนได้
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-4 pt-6 md:pt-0 md:pl-6">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                  จัดส่งฟรีทั่วประเทศ
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  บรรจุหีบห่อแน่นหนา ปลอดภัย จัดส่งด่วนพิเศษถึงหน้าบ้านพร้อมเลขพัสดุ
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Brand Info (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white text-black font-black text-sm flex items-center justify-center tracking-tight">
                YP
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-widest uppercase block">
                  {settings.store_name}
                </span>
                <span className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase block">
                  Luxury Brand-Name Catalog & Installment
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg font-normal">
              {settings.tagline}
            </p>

            {settings.footer_note && (
              <div className="pt-2">
                <p className="text-xs text-zinc-400 border-l-2 border-zinc-700 pl-3.5 py-0.5 leading-relaxed font-normal">
                  {settings.footer_note}
                </p>
              </div>
            )}
          </div>

          {/* Quick Categories Navigation (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-widest pb-2 border-b border-zinc-900">
              หมวดหมู่สินค้า
            </h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/?category=${cat.id}`} 
                  className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors block py-0.5"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-14 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-normal">
          <p>© {new Date().getFullYear()} {settings.store_name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span>ผ่อนสินค้าแบรนด์เนมแท้ 100%</span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-zinc-300 text-zinc-400 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


