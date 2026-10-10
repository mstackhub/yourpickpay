'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Category } from '@/types';
import { 
  FolderTree, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Layers
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, products, saveCategory, deleteCategory } = useStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const startCreate = () => {
    setName('');
    setSlug('');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setIsCreating(true);
    setEditingId(null);
  };

  const startEdit = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDisplayOrder(cat.display_order);
    setIsActive(cat.is_active);
    setEditingId(cat.id);
    setIsCreating(false);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (isCreating && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-') || `cat-${Date.now().toString().slice(-4)}`
      );
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Category = {
      id: editingId || `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || `cat-${Date.now().toString().slice(-4)}`,
      display_order: Number(displayOrder) || 1,
      is_active: isActive,
      created_at: new Date().toISOString(),
    };

    saveCategory(payload);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`คุณต้องการลบหมวดหมู่ "${catName}" ใช่หรือไม่?`)) {
      deleteCategory(id);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
            จัดการหมวดหมู่สินค้า (Categories)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            กำหนดหมวดหมู่น้ำหอม ลำดับการแสดงผล และสถานะเปิด/ปิด
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างหมวดหมู่ใหม่</span>
          </button>
        )}
      </div>

      {/* Inline Create / Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-2xl border-2 border-brand-500 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              {isCreating ? '➕ สร้างหมวดหมู่ใหม่' : '✏️ แก้ไขข้อมูลหมวดหมู่'}
            </h3>
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">ชื่อหมวดหมู่</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="เช่น น้ำหอมผู้ชาย (Men)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Slug URL</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="men"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">ลำดับการแสดงผล</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-brand-900 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-brand-950 flex items-center justify-center gap-1 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>บันทึก</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingId(null); }}
                className="px-3 py-2.5 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-xl hover:bg-gray-200"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-brand-200/70 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
            <tr>
              <th className="py-3.5 px-4">ลำดับ</th>
              <th className="py-3.5 px-4">ชื่อหมวดหมู่</th>
              <th className="py-3.5 px-4">Slug URL</th>
              <th className="py-3.5 px-4">จำนวนสินค้า</th>
              <th className="py-3.5 px-4">สถานะ</th>
              <th className="py-3.5 px-4 text-right">การกระทำ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedCategories.map((cat) => {
              const count = products.filter(p => p.category_id === cat.id).length;

              return (
                <tr key={cat.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-500">#{cat.display_order}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">{cat.name}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-500">{cat.slug}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-brand-50 text-brand-800 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                      {count} รายการ
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      cat.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {cat.is_active ? 'เปิดใช้งาน' : 'ปิด'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
