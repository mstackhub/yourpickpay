'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import InstallmentCalculatorWidget from '@/components/InstallmentCalculatorWidget';
import ProductCard from '@/components/ProductCard';
import FormattedDescription from '@/components/FormattedDescription';
import { 
  ChevronRight, 
  ShieldCheck, 
  Share2, 
  Check,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { products } = useStore();

  const product = useMemo(() => {
    return products.find(p => p.slug === slug || p.id === slug);
  }, [products, slug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id && p.status === 'published' && (p.category_id === product.category_id || p.brand === product.brand))
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-black flex items-center justify-center mx-auto text-2xl font-bold mb-4">
          📦
        </div>
        <h2 className="text-2xl font-black text-black">ไม่พบสินค้านี้ในระบบ</h2>
        <p className="text-sm text-zinc-500 mt-2 mb-6">สินค้าอาจถูกปิดการแสดงผล หรือ URL ไม่ถูกต้อง</p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
        >
          กลับสู่หน้าหลัก
        </Link>
      </div>
    );
  }

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  return (
    <div className="pb-24 space-y-8 bg-zinc-50/40">
      
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center justify-between gap-2 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-ellipsis">
              <Link href="/" className="hover:text-black transition-colors shrink-0">
                หน้าแรก
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              {product.category_id && (
                <>
                  <Link href={`/?category=${product.category_id}`} className="hover:text-black transition-colors shrink-0">
                    {product.category_name || 'หมวดหมู่'}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </>
              )}
              <span className="font-bold text-zinc-950 truncate max-w-[140px] sm:max-w-md">
                {product.name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShareLink}
              className="flex items-center gap-1.5 text-xs text-zinc-800 hover:text-black bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 transition-all font-semibold shrink-0 active:scale-95"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-zinc-600" />
                  <span>แชร์</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Showcase & Installment Calculator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Photo Showcase & Description (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Main Featured Image Box */}
            <div className="bg-white rounded-3xl border border-zinc-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden flex items-center justify-center aspect-square sm:aspect-[4/5] group">
              <img
                src={product.images[activeImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800'}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* SKU Pill */}
              <div className="absolute top-4 left-4">
                <span className="bg-zinc-950/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Authentic Guarantee Tag */}
              <div className="absolute top-4 right-4">
                <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-white" />
                  <span>ของแท้ 100%</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel (if multi images) */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border shrink-0 transition-all bg-white p-1.5 ${
                      activeImageIndex === idx
                        ? 'border-zinc-950 ring-2 ring-zinc-950/10 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee / Benefits Row */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-4 grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-zinc-600">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-zinc-900" />
                <span>รับประกันแท้ 100%</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-zinc-100">
                <Truck className="w-4 h-4 text-zinc-900" />
                <span>ส่งฟรีด่วนทั่วไทย</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Sparkles className="w-4 h-4 text-zinc-900" />
                <span>อนุมัติไว ไม่เช็คบูโร</span>
              </div>
            </div>

            {/* Product description with enhanced typography */}
            {product.description && (
              <div className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  รายละเอียดสินค้า (Product Details)
                </h4>
                <FormattedDescription text={product.description} />
              </div>
            )}
          </div>

          {/* Right Column: Installment Calculator Widget (7 cols) */}
          <div className="lg:col-span-7">
            <InstallmentCalculatorWidget product={product} />
          </div>

        </div>
      </div>

      {/* 3. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
                You Might Also Like
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-zinc-950">
                สินค้าอื่นๆ ในคอลเลกชัน
              </h3>
            </div>
            <Link href="/" className="text-xs font-bold text-zinc-800 hover:text-black hover:underline flex items-center gap-1">
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
