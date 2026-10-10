'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { calculateInstallment, getApplicablePlans, resolveProductDownPayment } from '@/lib/installmentEngine';

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
    <div className="bg-white border border-zinc-200 p-4 flex flex-col justify-between hover:border-black hover:shadow-md transition-all duration-200 group">
      {/* Product Image Frame */}
      <Link 
        href={`/product/${product.slug}`} 
        className="block relative aspect-square bg-zinc-50 overflow-hidden border border-zinc-100 mb-3.5"
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* SKU Code */}
          <div className="text-[11px] text-zinc-400 font-semibold tracking-wider uppercase">
            {product.sku}
          </div>

          {/* Name */}
          <Link href={`/product/${product.slug}`} className="block mt-1">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 line-clamp-1 hover:text-black">
              {product.name}
            </h3>
          </Link>

          {/* Cash Price */}
          <div className="text-base sm:text-lg font-black text-black mt-2">
            ฿{product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Installment Example */}
          {calc && (
            <div className="mt-2.5 pt-2 border-t border-zinc-100">
              <div className="text-[11px] text-zinc-500 font-normal">
                ตัวอย่างผ่อน {calc.duration_months} เดือน
              </div>
              <div className="text-sm font-bold text-black mt-0.5">
                ฿{calc.installment_per_period.toFixed(2)}/วัน
              </div>
            </div>
          )}
        </div>

        {/* Action Button: ดูรายละเอียด */}
        <Link
          href={`/product/${product.slug}`}
          className="mt-4 w-full py-2.5 px-4 border border-zinc-300 hover:border-black hover:bg-black hover:text-white text-center text-xs font-bold text-black uppercase tracking-wider transition-all duration-200 block"
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
