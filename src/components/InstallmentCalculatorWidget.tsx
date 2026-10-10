'use client';

import React, { useState, useMemo } from 'react';
import { Product, InstallmentFrequency } from '@/types';
import { useStore } from '@/lib/store';
import { calculateInstallment, getApplicablePlans, getFrequencyThaiLabel, resolveProductDownPayment } from '@/lib/installmentEngine';
import { 
  Copy, 
  Check, 
  MessageCircle,
  Coins,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight
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
  const [selectedDuration, setSelectedDuration] = useState<number>(() => 6);

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

  return (
    <div className={`bg-white rounded-3xl border border-zinc-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-6 sm:p-8 space-y-6 ${className}`}>
      
      {/* 1. Header: SKU & Product Name */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-zinc-100 text-zinc-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {product.sku}
            </span>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              {product.brand || 'Luxury'}
            </span>
          </div>

          <span className="bg-zinc-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>คำนวณค่างวดสด</span>
          </span>
        </div>

        <h1 className="text-lg sm:text-2xl font-extrabold text-zinc-950 tracking-tight leading-snug">
          {product.name}
        </h1>
      </div>

      {/* 2. Original Cash Price Row */}
      <div className="p-4 bg-zinc-50/80 rounded-2xl border border-zinc-100 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] text-zinc-500 font-medium block">ราคาสดเคาน์เตอร์ปกติ</span>
          <span className="text-2xl sm:text-3xl font-black text-zinc-950">
            ฿{product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {calculation && (
          <div className="text-right">
            <span className="text-[11px] text-zinc-500 font-medium block">เงื่อนไขเงินดาวน์</span>
            {calculation.down_payment_amount > 0 ? (
              <span className="text-sm sm:text-base font-bold text-zinc-900">
                ดาวน์ ฿{calculation.down_payment_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {downPayment.type === 'percentage' && ` (${downPayment.value}%)`}
              </span>
            ) : (
              <span className="text-sm sm:text-base font-bold text-emerald-700 flex items-center gap-1 justify-end">
                <Check className="w-4 h-4" />
                <span>ฟรีดาวน์ (0 บาท)</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Down payment & Financed Amount Row if > 0 */}
      {calculation && calculation.down_payment_amount > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">เงินดาวน์</span>
            <span className="text-sm sm:text-base font-black text-zinc-900">
              ฿{calculation.down_payment_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">ยอดจัดผ่อนจริง</span>
            <span className="text-sm sm:text-base font-black text-zinc-900">
              ฿{calculation.financed_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* 3. Section: ระยะเวลาผ่อน (Radio Cards) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
          1. เลือกระยะเวลาผ่อน (Duration)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {availableDurations.map((duration) => {
            const isSelected = selectedDuration === duration;
            const matchingPlan = applicablePlans.find(
              p => p.duration_months === duration && p.frequency === selectedFrequency
            ) || applicablePlans.find(p => p.duration_months === duration) || activePlan;
            
            const markupPercent = matchingPlan ? matchingPlan.markup_value : 0;

            return (
              <button
                key={duration}
                type="button"
                onClick={() => setSelectedDuration(duration)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm ring-1 ring-zinc-950'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50'
                }`}
              >
                <div className="font-extrabold text-sm sm:text-base">
                  {duration} เดือน
                </div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  +{markupPercent}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Section: รอบการชำระเงิน (Segmented Switcher) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
          2. เลือกรอบการชำระเงิน (Payment Frequency)
        </label>
        <div className="grid grid-cols-3 gap-2 bg-zinc-100 p-1 rounded-2xl">
          {(['daily', 'weekly', 'monthly'] as InstallmentFrequency[]).map((freq) => {
            const isSelected = selectedFrequency === freq;

            return (
              <button
                key={freq}
                type="button"
                onClick={() => setSelectedFrequency(freq)}
                className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all text-center ${
                  isSelected
                    ? 'bg-white text-zinc-950 shadow-xs ring-1 ring-black/5'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {getFrequencyThaiLabel(freq)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Section: ผลลัพธ์ยอดชำระเฉลี่ยต่องวด (Dark Luxury Box) */}
      {calculation && (
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-5 sm:p-6 rounded-2xl shadow-lg relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>ยอดชำระเฉลี่ยต่องวด ({calculation.frequency_th})</span>
            <span className="text-emerald-400 font-bold">{calculation.duration_months} เดือน</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ฿{calculation.installment_per_period.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-zinc-400">
              / {calculation.frequency === 'daily' ? 'วัน' : calculation.frequency === 'weekly' ? 'สัปดาห์' : 'เดือน'}
            </span>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300">
            <span>จำนวนงวด: <strong className="text-white">{calculation.total_periods}</strong> งวด</span>
            <span>ยอดรวมทั้งสิ้น: <strong className="text-white">฿{calculation.total_installment_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
          </div>
        </div>
      )}

      {/* 6. Section: ข้อมูลที่จะคัดลอก (Copy text preview) */}
      {calculation && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
            ข้อมูลที่จะคัดลอก (สำหรับส่งเปิดสัญญา)
          </label>
          <div className="text-xs font-mono text-zinc-800 leading-relaxed whitespace-pre-wrap select-all bg-zinc-50 rounded-xl border border-zinc-200 p-3.5 max-h-36 overflow-y-auto">
            {calculation.copy_text}
          </div>
        </div>
      )}

      {/* 7. Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`w-full py-3.5 px-4 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] border ${
            copied
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-zinc-950 hover:bg-black text-white border-zinc-950'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>คัดลอกข้อมูลเรียบร้อยแล้ว!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>คัดลอกข้อมูลสินค้าและแผนผ่อน</span>
            </>
          )}
        </button>

        {/* LINE OA Button */}
        <button
          type="button"
          onClick={handleLineContact}
          className="w-full py-3.5 px-4 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>ทัก LINE เปิดสัญญาผ่อนสินค้านี้</span>
        </button>
      </div>

      {/* 8. Footnote */}
      <p className="text-[11px] text-zinc-400 leading-relaxed text-center font-normal">
        *การคำนวณเป็นยอดประมาณการเพื่อประกอบการตัดสินใจ สัญญาจริงจะเป็นไปตามเงื่อนไขที่ตกลง
      </p>

    </div>
  );
}
