'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import InstallmentCalculatorWidget from '@/components/InstallmentCalculatorWidget';
import SalePageRenderer from '@/components/SalePageRenderer';
import ProductCard from '@/components/ProductCard';
import FormattedDescription from '@/components/FormattedDescription';
import { 
  ChevronRight, 
  ShieldCheck, 
  Share2, 
  Check
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
        <div className="w-16 h-16 rounded-full bg-gray-100 text-black flex items-center justify-center mx-auto text-2xl font-bold mb-4">
          📦
        </div>
        <h2 className="text-2xl font-bold text-black">ไม่พบสินค้านี้ในระบบ</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">สินค้าอาจถูกปิดการแสดงผล หรือ URL ไม่ถูกต้อง</p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors"
        >
          กลับหน้าหลัก
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
    <div className="pb-24 space-y-10 bg-white">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-black transition-colors">
                หน้าแรก
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              {product.category_id && (
                <>
                  <Link href={`/?category=${product.category_id}`} className="hover:text-black transition-colors">
                    {product.category_name || 'หมวดหมู่'}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </>
              )}
              <span className="font-bold text-black truncate max-w-xs sm:max-w-md">
                {product.name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShareLink}
              className="flex items-center gap-1.5 text-xs text-black hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition-colors font-semibold shrink-0"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>แชร์</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* 2. Top Product Showcase & Calculator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Photo Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-[4/5] bg-zinc-50 overflow-hidden border border-zinc-200 shadow-xs flex items-center justify-center p-6">
              <img
                src={product.images[activeImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800'}
                alt={product.name}
                className="w-full h-full object-contain object-center"
              />
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 overflow-hidden border shrink-0 transition-all bg-zinc-50 p-1.5 ${
                      activeImageIndex === idx
                        ? 'border-black shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-500 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Product description */}
            {product.description && (
              <FormattedDescription text={product.description} />
            )}
          </div>

          {/* Right Column: Installment Calculator Widget (7 cols) */}
          <div className="lg:col-span-7">
            <InstallmentCalculatorWidget product={product} />
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                You Might Also Like
              </span>
              <h3 className="font-black text-xl sm:text-2xl text-black">
                สินค้าอื่นๆ ที่คุณอาจสนใจ
              </h3>
            </div>
            <Link href="/" className="text-xs sm:text-sm font-bold text-black hover:underline">
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
