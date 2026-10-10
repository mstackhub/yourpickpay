'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Lock, Mail, KeyRound, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminLoggedIn } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Validate credentials (supports 'admin' or admin email with password 'admin12345')
      const inputIdentifier = email.trim().toLowerCase();
      const inputPass = password.trim();

      const isValidUser = inputIdentifier === 'admin' || inputIdentifier === 'admin@yourpickpay.com' || inputIdentifier === 'mstackhub';
      const isValidPass = inputPass === 'admin12345' || inputPass === 'yourpickpay2026';

      if (isValidUser && isValidPass) {
        setAdminLoggedIn(true);
        router.push('/admin');
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 sm:p-6 text-white">
      <div className="w-full max-w-md">
        {/* Back to store */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังหน้าร้าน YOURPICKPAY</span>
        </Link>

        {/* Login Box */}
        <div className="bg-white text-black p-8 sm:p-10 shadow-2xl border border-zinc-200 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-black text-2xl text-black">
              Admin Portal Login
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              เข้าสู่ระบบจัดการสินค้า เงื่อนไขผ่อน และ Sale Page CMS
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                ชื่อผู้ใช้หรืออีเมล (Username / Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-black focus:bg-white font-medium text-black"
                  placeholder="admin หรือ admin@yourpickpay.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-black focus:bg-white font-medium text-black"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Sign In)'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
