'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { calculateInstallment, getApplicablePlans, resolveProductDownPayment } from '@/lib/installmentEngine';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { plans: allPlans, settings } = useStore();
  
  // Find 6-month daily plan or first active daily plan
  const applicablePlans = getApplicablePlans(product, allPlans);
  const preferredPlan = applicablePlans.find(p => p.frequency === 'daily' && p.duration_months === 6)
    || applicablePlans.find(p => p.frequency === 'daily')
    || applicablePlans[0];

  const downPayment = resolveProductDownPayment(product, settings);

  const calc = preferredPlan 
    ? calculateInstallment(product.original_price, preferredPlan, { sku: product.sku, name: product.name }, downPayment)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group p-3 sm:p-4">
      
      {/* 1. Product Image Frame */}
      <Link 
        href={`/product/${product.slug}`} 
        className="block relative aspect-square bg-gradient-to-b from-zinc-50 via-zinc-50/60 to-zinc-100/30 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center p-3"
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="bg-zinc-950/85 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            {product.sku}
          </span>
        </div>

        {/* Down payment tag if applicable */}
        {calc && (
          <div className="absolute top-2 right-2">
            {calc.down_payment_amount > 0 ? (
              <span className="bg-zinc-900/80 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                ดาวน์ ฿{calc.down_payment_amount.toLocaleString()}
              </span>
            ) : (
              <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>ฟรีดาวน์</span>
              </span>
            )}
          </div>
        )}
      </Link>

      {/* 2. Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-[10px] sm:text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
            {product.brand || 'Luxury Brand'}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block mt-0.5">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-2 leading-snug group-hover:text-black transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Price & Installment Showcase */}
          <div className="mt-3 pt-2.5 border-t border-zinc-100 flex flex-col gap-1">
            {/* Cash Price */}
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-[11px] text-zinc-400 font-medium">ราคาสด</span>
              <span className="text-sm sm:text-base font-black text-zinc-950">
                ฿{product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Installment Highlight Box */}
            {calc && (
              <div className="mt-1 bg-zinc-50 group-hover:bg-zinc-100/80 rounded-lg p-2 transition-colors flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-zinc-500 font-medium">
                  ผ่อนเริ่มต้น ({calc.duration_months}ด.)
                </span>
                <span className="text-xs sm:text-sm font-black text-emerald-700">
                  ฿{calc.installment_per_period.toFixed(2)}/วัน
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Action Button */}
        <Link
          href={`/product/${product.slug}`}
          className="mt-3.5 w-full py-2.5 px-3 bg-zinc-950 group-hover:bg-black text-white rounded-xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
        >
          <span>ดูเงื่อนไขผ่อน</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
