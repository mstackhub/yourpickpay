'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import { 
  Search, 
  ArrowUpDown,
  X,
  Check,
  Sparkles,
  ShieldCheck,
  Layers
} from 'lucide-react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || 'all';

  const { products, categories, settings } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryParam);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'name'>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'newest', label: 'สินค้าแนะนำ / ล่าสุด' },
    { value: 'price_asc', label: 'ราคาเงินสด: ต่ำ - สูง' },
    { value: 'price_desc', label: 'ราคาเงินสด: สูง - ต่ำ' },
    { value: 'name', label: 'ชื่อสินค้า A - Z' },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'สินค้าแนะนำ / ล่าสุด';

  // Filter and sort products (only published for customer)
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (product.status !== 'published') return false;

        if (selectedCategory !== 'all' && product.category_id !== selectedCategory) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchSku = product.sku?.toLowerCase().includes(q);
          const matchName = product.name?.toLowerCase().includes(q);
          const matchBrand = product.brand?.toLowerCase().includes(q);
          if (!matchSku && !matchName && !matchBrand) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.original_price - b.original_price;
        if (sortBy === 'price_desc') return b.original_price - a.original_price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-50/40 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-20">
      
      {/* 1. Hero / Header Title Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authentic Luxury Brand-name Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans text-white">
              แคตตาล็อกสินค้าแบรนด์เนมแท้ 100%
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              ผ่อนสินค้าแบรนด์เนมแท้เคาน์เตอร์ รายวัน รายสัปดาห์ รายเดือน อนุมัติง่าย ไม่เช็คบูโร พร้อมคำนวณค่างวดแบบ Real-time
            </p>
          </div>
          
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 2. Search, Filter & Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Search & Sorting Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตามรหัสสินค้า (เช่น CX001, YPP0001), ชื่อสินค้า, หรือแบรนด์..."
                className="w-full pl-11 pr-10 py-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-sm sm:text-base text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all font-medium placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Custom Sort Select Box */}
            <div className="relative shrink-0" ref={sortRef}>
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className={`w-full md:w-auto px-4 py-2.5 bg-white rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-2xs hover:bg-zinc-50 active:bg-zinc-100 transition-all cursor-pointer select-none ${
                  sortOpen ? 'border-zinc-950 text-zinc-950 ring-1 ring-zinc-950' : 'border-zinc-200 text-zinc-800 hover:border-zinc-400'
                }`}
              >
                <span>{currentSortLabel}</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              </button>

              {/* Custom Dropdown Menu */}
              {sortOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl border border-zinc-200 shadow-xl z-50 overflow-hidden divide-y divide-zinc-100 animate-in fade-in duration-150">
                  {sortOptions.map((opt) => {
                    const isSelected = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.value as any);
                          setSortOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-zinc-950 text-white font-bold'
                            : 'text-zinc-800 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-black'
              }`}
            >
              ทั้งหมด ({products.filter(p => p.status === 'published').length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(p => p.status === 'published' && p.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-black'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count Info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 px-1 font-medium">
          <span>พบสินค้าทั้งหมด <strong className="text-zinc-950 font-bold">{filteredProducts.length}</strong> รายการ</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-950 hover:underline font-bold"
            >
              ล้างคำค้นหา &ldquo;{searchQuery}&rdquo;
            </button>
          )}
        </div>

        {/* Product Grid Layout */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-200 p-8 space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center mx-auto text-2xl font-bold">
              🔍
            </div>
            <h3 className="font-extrabold text-lg text-zinc-950">ไม่พบสินค้าที่ตรงกับคำค้นหา</h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
              ลองเปลี่ยนคำค้นหา หรือเลือกรุ่นอื่นในหมวดหมู่ หรือกดดูสินค้าทั้งหมด
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2.5 bg-zinc-950 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
            >
              ดูสินค้าทั้งหมด
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
