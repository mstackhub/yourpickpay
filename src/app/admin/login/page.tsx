'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Lock, Mail, KeyRound, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminLoggedIn } = useStore();
  const [email, setEmail] = useState('admin@yourpickpay.com');
  const [password, setPassword] = useState('admin12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email.trim() && password.trim().length >= 4) {
        setAdminLoggedIn(true);
        router.push('/admin');
      } else {
        setError('กรุณากรอกอีเมลและรหัสผ่านให้ถูกต้อง');
        setLoading(false);
      }
    }, 300);
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@yourpickpay.com');
    setPassword('admin12345');
    setError('');
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
            <div className="p-3.5 bg-gray-100 border border-gray-300 rounded-xl text-xs text-black font-semibold flex items-center gap-2">
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

          {/* Quick Fill Box */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="inline-flex items-center gap-1.5 text-xs text-black hover:underline font-bold py-1 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span>กรอกข้อมูลทดสอบอัตโนมัติ (Demo Auto-fill)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
