'use client';

import React, { useState, useMemo } from 'react';
import { Product, InstallmentFrequency } from '@/types';
import { useStore } from '@/lib/store';
import { calculateInstallment, getApplicablePlans, getFrequencyThaiLabel, resolveProductDownPayment } from '@/lib/installmentEngine';
import { 
  Copy, 
  Check, 
  MessageCircle 
} from 'lucide-react';

interface Props {
  product: Product;
  className?: string;
  initialPlanId?: string;
}

export default function InstallmentCalculatorWidget({ product, className = '', initialPlanId }: Props) {
  const { plans: allGlobalPlans, settings } = useStore();
  const [copied, setCopied] = useState(false);

  // Applicable plans for this product
  const applicablePlans = useMemo(() => {
    return getApplicablePlans(product, allGlobalPlans);
  }, [product, allGlobalPlans]);

  // Resolve Down Payment
  const downPayment = useMemo(() => {
    return resolveProductDownPayment(product, settings);
  }, [product, settings]);

  // Selected duration months (2, 3, 6, 12)
  const [selectedDuration, setSelectedDuration] = useState<number>(() => {
    return 6;
  });

  // Selected Frequency ('daily' | 'weekly' | 'monthly')
  const [selectedFrequency, setSelectedFrequency] = useState<InstallmentFrequency>('weekly');

  // Available unique durations
  const availableDurations = useMemo(() => {
    const durations = new Set<number>();
    applicablePlans.forEach(p => durations.add(p.duration_months));
    return Array.from(durations).sort((a, b) => a - b);
  }, [applicablePlans]);

  // Current active plan matching duration & frequency
  const activePlan = useMemo(() => {
    let match = applicablePlans.find(
      p => p.duration_months === selectedDuration && p.frequency === selectedFrequency
    );
    if (!match) {
      const durationPlan = applicablePlans.find(p => p.duration_months === selectedDuration);
      const fallbackMarkup = durationPlan ? durationPlan.markup_value : (selectedDuration === 2 ? 10 : selectedDuration === 3 ? 8 : 12);
      const fallbackMarkupType = durationPlan ? durationPlan.markup_type : 'percentage';

      match = {
        id: `plan-auto-${selectedDuration}-${selectedFrequency}`,
        name: `ผ่อน${getFrequencyThaiLabel(selectedFrequency)} ${selectedDuration} เดือน`,
        duration_months: selectedDuration,
        frequency: selectedFrequency,
        markup_type: fallbackMarkupType,
        markup_value: fallbackMarkup,
        is_active: true,
        is_default: true,
        display_order: 99
      };
    }
    return match;
  }, [applicablePlans, selectedDuration, selectedFrequency]);

  // Calculate results
  const calculation = useMemo(() => {
    if (!activePlan) return null;
    return calculateInstallment(
      product.original_price,
      activePlan,
      {
        sku: product.sku,
        name: product.name
      },
      downPayment
    );
  }, [product, activePlan, downPayment]);

  const handleCopy = async () => {
    if (!calculation) return;
    try {
      await navigator.clipboard.writeText(calculation.copy_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleLineContact = () => {
    if (!calculation) return;
    const text = encodeURIComponent(
      `สวัสดีครับ สนใจผ่อนสินค้า\n${calculation.copy_text}\nขอทราบรายละเอียดการเปิดสัญญาครับ`
    );
    const lineUrl = `${settings.line_oa_url || 'https://line.me'}?text=${text}`;
    window.open(lineUrl, '_blank');
  };

  const scrollToMore = () => {
    window.scrollBy({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className={`bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs relative ${className}`}>
      
      {/* 1. Header: SKU — Name & 'ตัวอย่าง' Badge */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
          {product.sku} — {product.name}
        </h2>
        <span className="bg-zinc-100 text-zinc-700 text-xs px-2.5 py-1 font-semibold uppercase tracking-wider shrink-0 border border-zinc-200">
          ตัวอย่าง
        </span>
      </div>

      {/* 2. Original Cash Price */}
      <div className="text-2xl sm:text-3xl font-black text-black mt-2">
        ฿{product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      {/* Down payment info badge if applicable */}
      {calculation && calculation.down_payment_amount > 0 && (
        <div className="mt-3 p-3 bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-500 font-medium">เงินดาวน์: </span>
            <span className="font-black text-black">
              ฿{calculation.down_payment_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {downPayment.type === 'percentage' && ` (${downPayment.value}%)`}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 font-medium">ยอดจัดผ่อน: </span>
            <span className="font-black text-black">
              ฿{calculation.financed_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* 3. Section: ระยะเวลาผ่อน (Radio List) */}
      <div className="mt-6 pt-4 border-t border-zinc-100">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-3">
          ระยะเวลาผ่อน
        </label>
        <div className="space-y-2.5">
          {availableDurations.map((duration) => {
            const isSelected = selectedDuration === duration;
            const matchingPlan = applicablePlans.find(
              p => p.duration_months === duration && p.frequency === selectedFrequency
            ) || applicablePlans.find(p => p.duration_months === duration) || activePlan;
            
            const markupPercent = matchingPlan ? matchingPlan.markup_value : 0;

            return (
              <label
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className="flex items-center gap-3 cursor-pointer select-none py-1 group"
              >
                <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                  isSelected ? 'border-black bg-black' : 'border-zinc-300 bg-white group-hover:border-zinc-700'
                }`}>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-white" />
                  )}
                </div>
                <span className={`text-sm ${isSelected ? 'text-black font-bold' : 'text-zinc-700 font-medium'}`}>
                  {duration} เดือน (+{markupPercent}%)
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Section: รอบการชำระเงิน (Segmented Switcher) */}
      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2.5">
          รอบการชำระเงิน
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['daily', 'weekly', 'monthly'] as InstallmentFrequency[]).map((freq) => {
            const isSelected = selectedFrequency === freq;

            return (
              <button
                key={freq}
                type="button"
                onClick={() => setSelectedFrequency(freq)}
                className={`py-2.5 px-3 text-xs sm:text-sm font-bold transition-all text-center border ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-black'
                }`}
              >
                {getFrequencyThaiLabel(freq)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Section: ยอดชำระเฉลี่ยต่องวด */}
      {calculation && (
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
            ยอดชำระเฉลี่ยต่องวด
          </span>
          <div className="text-3xl sm:text-4xl font-black text-black mt-1">
            ฿{calculation.installment_per_period.toFixed(2)}
          </div>
          <div className="text-xs sm:text-sm text-zinc-600 mt-1 font-medium">
            {calculation.total_periods} งวด · ยอดรวม ฿{calculation.total_installment_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      )}

      {/* 6. Section: ข้อมูลที่จะคัดลอก (Copy text preview) */}
      {calculation && (
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            ข้อมูลที่จะคัดลอก
          </label>
          <div className="text-xs font-mono text-zinc-800 leading-relaxed whitespace-pre-wrap select-all bg-zinc-50 border border-zinc-200 p-3">
            {calculation.copy_text}
          </div>
        </div>
      )}

      {/* 7. Action Button: [ 📋 คัดลอกข้อมูลสินค้าและแผนผ่อน ] */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handleCopy}
          className={`w-full py-3.5 px-4 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
            copied
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-black hover:bg-zinc-800 text-white border-black active:scale-[0.99]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>คัดลอกข้อมูลเรียบร้อยแล้ว</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>คัดลอกข้อมูลสินค้าและแผนผ่อน</span>
            </>
          )}
        </button>
      </div>

      {/* 8. Footnote */}
      <p className="text-[11px] text-zinc-400 leading-relaxed mt-4 font-normal">
        ตัวอย่างนี้ใช้เดือนละ 30 วัน ส่วนรายสัปดาห์ปัดจำนวนงวดขึ้นและเฉลี่ยเงินเท่ากัน งวดจริงต้องปรับยอดสุดท้ายและกำหนดวันครบกำหนดให้ชัดเจน
      </p>

    </div>
  );
}
