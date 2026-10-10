'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { getStartingInstallment } from '@/lib/installmentEngine';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Layers, 
  CheckCircle, 
  EyeOff, 
  Archive,
  ArrowUpDown
} from 'lucide-react';

export default function AdminProductsPage() {
  const { products, categories, plans, saveProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
      if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const mSku = p.sku?.toLowerCase().includes(q);
        const mName = p.name?.toLowerCase().includes(q);
        const mBrand = p.brand?.toLowerCase().includes(q);
        if (!mSku && !mName && !mBrand) return false;
      }
      return true;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const handleDuplicate = (product: any) => {
    const newSku = `${product.sku}-COPY`;
    const newSlug = `${product.slug}-copy-${Date.now().toString().slice(-4)}`;
    const duplicated = {
      ...product,
      id: `prod-${Date.now()}`,
      sku: newSku,
      name: `${product.name} (คัดลอก)`,
      slug: newSlug,
      status: 'draft' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveProduct(duplicated);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบสินค้า "${name}" ใช่หรือไม่?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
            จัดการรายการน้ำหอม (Products)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            สร้าง แก้ไข กำหนดราคา และสร้าง Sale Page ประจำสินค้า
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มสินค้าใหม่ (Add Product)</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-200/70 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา SKU, ชื่อ, หรือแบรนด์..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">📁 หมวดหมู่ทั้งหมด</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">🔘 สถานะทั้งหมด</option>
              <option value="published">🟢 เผยแพร่ (Published)</option>
              <option value="draft">🟡 แบบร่าง (Draft)</option>
              <option value="archived">⚪ เก็บถาวร (Archived)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">รูปภาพ</th>
                <th className="py-3.5 px-4">SKU / รหัสสินค้า</th>
                <th className="py-3.5 px-4">ชื่อสินค้า / แบรนด์</th>
                <th className="py-3.5 px-4">หมวดหมู่</th>
                <th className="py-3.5 px-4">ราคาสด</th>
                <th className="py-3.5 px-4">ผ่อนเริ่มต้น</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4 text-right">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const start = getStartingInstallment(p, plans);

                return (
                  <tr key={p.id} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100'}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-brand-900 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                        {p.sku}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-[11px] font-bold text-brand-600 uppercase">{p.brand}</div>
                      <div className="font-bold text-gray-900 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{p.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {p.category_name || '-'}
                    </td>
                    <td className="py-3 px-4 font-black text-gray-900">
                      ฿{p.original_price.toLocaleString()}.-
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-emerald-700">
                      {start.lowestPeriodText || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        p.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status === 'published' ? 'เผยแพร่' : p.status === 'draft' ? 'แบบร่าง' : 'เก็บถาวร'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/sale-page-builder/${p.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-gold-50 text-gold-900 hover:bg-gold-100 font-semibold text-xs border border-gold-300 flex items-center gap-1"
                          title="CMS Sale Page Builder"
                        >
                          <Layers className="w-3.5 h-3.5 text-gold-600" />
                          <span>Sale Page</span>
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                          title="คัดลอก (Duplicate)"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                          title="เปิดดูหน้าร้าน"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    ไม่พบรายการสินค้าที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
