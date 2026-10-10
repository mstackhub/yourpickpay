'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { calculateInstallment, getStartingInstallment } from '@/lib/installmentEngine';
import { 
  Package, 
  FolderTree, 
  Percent, 
  Plus, 
  ExternalLink, 
  TrendingUp, 
  ArrowUpRight,
  Layers,
  Edit,
  Calculator,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { products, categories, plans, settings } = useStore();

  // Calculation Quick Simulator State
  const [testPrice, setTestPrice] = useState<number>(5200);
  const [testPlanId, setTestPlanId] = useState<string>(() => plans[0]?.id || '');

  const publishedCount = products.filter(p => p.status === 'published').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const activePlansCount = plans.filter(p => p.is_active).length;

  const selectedPlan = plans.find(p => p.id === testPlanId) || plans[0];
  const simCalc = selectedPlan ? calculateInstallment(testPrice, selectedPlan, { sku: 'TEST-SKU', name: 'ตัวอย่างน้ำหอมทดสอบ' }) : null;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Overview & Management System</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            ระบบจัดการ {settings.store_name}
          </h1>
          <p className="text-brand-200 text-xs sm:text-sm mt-1 max-w-xl">
            จัดการรายการน้ำหอม รหัส SKU เงื่อนไขการผ่อนชำระ Sale Page Builder และดูการคำนวณค่างวดแบบเรียลไทม์
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-brand-950 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มสินค้าใหม่</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-brand-800 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-brand-700 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>ดูหน้าร้านจริง</span>
          </Link>
        </div>
      </div>

      {/* 2. Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">สินค้าทั้งหมด</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{products.length}</div>
            <span className="text-[11px] text-emerald-600 font-medium">เผยแพร่ {publishedCount} / ร่าง {draftCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">แผนการผ่อนชำระ</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{plans.length}</div>
            <span className="text-[11px] text-gold-600 font-medium">เปิดใช้งานอยู่ {activePlansCount} แผน</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">หมวดหมู่สินค้า</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{categories.length}</div>
            <span className="text-[11px] text-brand-600 font-medium">เปิดใช้งานทั้งหมด</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">ผ่อนเริ่มต้น</span>
            <div className="text-2xl sm:text-3xl font-black text-brand-900 mt-1">~฿33</div>
            <span className="text-[11px] text-gray-500">บาท/วัน (รายวัน 6 เดือน)</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Real-time Calculation Engine Simulator */}
      <div className="bg-white rounded-3xl border border-brand-200/80 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Calculator className="w-5 h-5 text-brand-600" />
          <h2 className="font-bold text-lg text-gray-900">
            ระบบทดสอบเครื่องคำนวณราคาผ่อน (Calculation Engine Simulator)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Simulator Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                กำหนดราคาสดเพื่อทดสอบ (Original Price - THB):
              </label>
              <input
                type="number"
                value={testPrice}
                onChange={(e) => setTestPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                เลือกแผนผ่อนชำระที่ต้องการทดสอบ:
              </label>
              <select
                value={testPlanId}
                onChange={(e) => setTestPlanId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (+{p.markup_value}{p.markup_type === 'percentage' ? '%' : ' THB'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Simulator Output Cards */}
          {simCalc && (
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-50/50 p-4 rounded-2xl border border-brand-200">
              <div className="bg-white p-3 rounded-xl shadow-2xs">
                <span className="text-[11px] text-gray-500 block">ราคาสด</span>
                <span className="font-black text-gray-900 text-base">฿{simCalc.original_price.toLocaleString()}</span>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-2xs">
                <span className="text-[11px] text-gray-500 block">ยอดบวกเพิ่ม</span>
                <span className="font-black text-brand-700 text-base">+฿{simCalc.markup_amount.toLocaleString()}</span>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-2xs">
                <span className="text-[11px] text-gray-500 block">ยอดรวมทั้งสิ้น</span>
                <span className="font-black text-brand-950 text-base">฿{simCalc.total_installment_price.toLocaleString()}</span>
              </div>
              <div className="bg-brand-900 text-white p-3 rounded-xl shadow-sm">
                <span className="text-[11px] text-gold-300 block font-medium">ค่างวด ({simCalc.frequency_th})</span>
                <span className="font-extrabold text-gold-400 text-lg">฿{simCalc.installment_per_period.toFixed(2)}</span>
              </div>

              {/* Copy String Format Preview */}
              <div className="col-span-2 sm:col-span-4 mt-2">
                <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-1">
                  ตัวอย่างข้อความ Output ที่ลูกค้าจะคัดลอก:
                </span>
                <pre className="bg-gray-900 text-brand-100 p-3 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                  {simCalc.copy_text}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Recent Products Table */}
      <div className="bg-white rounded-3xl border border-brand-200/80 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-gray-900">รายการสินค้าล่าสุด</h2>
            <p className="text-xs text-gray-500">จัดการข้อมูลน้ำหอมและเข้าสู่ Sale Page Builder</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            <span>จัดการสินค้าทั้งหมด ({products.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-y border-gray-200">
              <tr>
                <th className="py-3 px-4">สินค้า (SKU / Name)</th>
                <th className="py-3 px-4">แบรนด์</th>
                <th className="py-3 px-4">ราคาสด</th>
                <th className="py-3 px-4">ผ่อนเริ่มต้น</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">เครื่องมือ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.slice(0, 5).map((p) => {
                const start = getStartingInstallment(p, plans);

                return (
                  <tr key={p.id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                        />
                        <div>
                          <span className="font-mono text-xs font-bold text-brand-700 block">{p.sku}</span>
                          <span className="font-semibold text-gray-900 line-clamp-1">{p.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">{p.brand}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">฿{p.original_price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-emerald-700">
                      {start.lowestPeriodText || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status === 'published' ? 'เผยแพร่' : p.status === 'draft' ? 'ร่าง' : 'เก็บถาวร'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/sale-page-builder/${p.id}`}
                          className="p-1.5 rounded-lg bg-gold-50 text-gold-800 hover:bg-gold-100 text-xs font-medium flex items-center gap-1 border border-gold-300"
                          title="CMS Sale Page Builder"
                        >
                          <Layers className="w-3.5 h-3.5 text-gold-600" />
                          <span className="hidden sm:inline">Sale Page</span>
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700 text-xs"
                          title="แก้ไขข้อมูลสินค้า"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700 text-xs"
                          title="ดูหน้าเว็บจริง"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
