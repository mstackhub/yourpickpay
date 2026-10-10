'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Percent, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  Layers,
  RotateCcw
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, setAdminLoggedIn, resetDefaults, isLoaded } = useStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login page, render children directly without sidebar
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoaded && !isAdmin && !isLoginPage) {
      router.push('/admin/login');
    }
    if (isAdmin) {
      router.prefetch('/admin');
      router.prefetch('/admin/products');
      router.prefetch('/admin/categories');
      router.prefetch('/admin/installments');
      router.prefetch('/admin/settings');
    }
  }, [isAdmin, isLoginPage, isLoaded, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isLoaded || !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-zinc-400">กำลังตรวจสอบสิทธิ์ Admin...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'แดชบอร์ด (Dashboard)', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'จัดการสินค้า (Products)', href: '/admin/products', icon: Package },
    { name: 'หมวดหมู่สินค้า (Categories)', href: '/admin/categories', icon: FolderTree },
    { name: 'เงื่อนไขการผ่อน (Installment Plans)', href: '/admin/installments', icon: Percent },
    { name: 'ตั้งค่าเว็บไซต์ (Website Settings)', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    setAdminLoggedIn(false);
    router.push('/admin/login');
  };

  const handleResetData = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นทั้งหมดหรือไม่?')) {
      resetDefaults();
      alert('รีเซ็ตข้อมูลตัวอย่างสำเร็จแล้ว!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-black text-white p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center text-sm">
            YP
          </div>
          <span className="font-bold text-sm tracking-wide">ADMIN PORTAL</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 bg-zinc-900 text-white border border-zinc-800"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-black text-white flex flex-col justify-between p-5 border-r border-zinc-900 transition-transform duration-200 ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black font-black text-base flex items-center justify-center shadow-xs">
                YP
              </div>
              <div>
                <span className="font-bold text-base block text-white tracking-wide">YOURPICKPAY</span>
                <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">CMS & Admin Panel</span>
              </div>
            </div>
            <button onClick={() => setMobileNavOpen(false)} className="md:hidden text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3 block mb-2">
              เมนูหลัก
            </span>
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-medium transition-all border ${
                    isActive
                      ? 'bg-zinc-900 text-white font-bold border-zinc-700 shadow-xs'
                      : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-6 border-t border-zinc-900">
          <Link
            href="/"
            target="_blank"
            prefetch={true}
            className="flex items-center justify-between px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>เปิดดูหน้าร้าน (Storefront)</span>
            </span>
            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 text-zinc-300 font-mono">Live</span>
          </Link>

          <button
            type="button"
            onClick={handleResetData}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>รีเซ็ตข้อมูลตัวอย่าง (Reset Data)</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ (Sign Out)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
