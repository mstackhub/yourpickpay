'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { InstallmentPlan, InstallmentFrequency, MarkupType } from '@/types';
import { calculateInstallment, getFrequencyThaiLabel } from '@/lib/installmentEngine';
import { 
  Percent, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Calculator, 
  Calendar,
  Layers,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AdminInstallmentsPage() {
  const { plans, savePlan, deletePlan } = useStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [frequency, setFrequency] = useState<InstallmentFrequency>('daily');
  const [markupType, setMarkupType] = useState<MarkupType>('percentage');
  const [markupValue, setMarkupValue] = useState<number>(15);
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  // Test Simulation Price
  const [simPrice, setSimPrice] = useState<number>(5700);

  const startCreate = () => {
    setName('ผ่อนรายวัน 6 เดือน (180 วัน)');
    setDurationMonths(6);
    setFrequency('daily');
    setMarkupType('percentage');
    setMarkupValue(15);
    setIsActive(true);
    setIsDefault(true);
    setDisplayOrder(plans.length + 1);
    setIsCreating(true);
    setEditingId(null);
  };

  const startEdit = (plan: InstallmentPlan) => {
    setName(plan.name);
    setDurationMonths(plan.duration_months);
    setFrequency(plan.frequency);
    setMarkupType(plan.markup_type || 'percentage');
    setMarkupValue(plan.markup_value);
    setIsActive(plan.is_active);
    setIsDefault(plan.is_default);
    setDisplayOrder(plan.display_order);
    setEditingId(plan.id);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: InstallmentPlan = {
      id: editingId || `plan-${Date.now()}`,
      name: name.trim(),
      duration_months: Number(durationMonths) || 1,
      frequency,
      markup_type: markupType,
      markup_value: Number(markupValue) || 0,
      is_active: isActive,
      is_default: isDefault,
      display_order: Number(displayOrder) || 1,
      updated_at: new Date().toISOString(),
    };

    savePlan(payload);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleDelete = (id: string, planName: string) => {
    if (confirm(`คุณต้องการลบแผนผ่อน "${planName}" ใช่หรือไม่?`)) {
      deletePlan(id);
    }
  };

  // Live preview for current form values
  const currentPlanPreview: InstallmentPlan = useMemo(() => ({
    id: 'preview',
    name: name || 'แผนตัวอย่าง',
    duration_months: Number(durationMonths) || 1,
    frequency,
    markup_type: markupType,
    markup_value: Number(markupValue) || 0,
    is_active: true,
    is_default: isDefault,
    display_order: 1,
  }), [name, durationMonths, frequency, markupType, markupValue, isDefault]);

  const previewCalc = useMemo(() => {
    return calculateInstallment(simPrice, currentPlanPreview, {
      sku: 'YPP0001',
      name: 'Dior Sauvage'
    });
  }, [simPrice, currentPlanPreview]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black pb-4">
        <div>
          <h1 className="font-black text-2xl uppercase tracking-tight text-black">
            เงื่อนไขการผ่อนชำระส่วนกลาง (Global Installment Plans)
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            กำหนดแผนมาตรฐาน (Default) กำหนดยอดบวกเพิ่มได้ทั้ง % (Percentage) หรือ ยอดคงที่ (Fixed THB)
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            type="button"
            onClick={startCreate}
            className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-transform active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างแผนผ่อนใหม่</span>
          </button>
        )}
      </div>

      {/* Inline Create / Edit Form with Live Engine Tester */}
      {(isCreating || editingId) && (
        <div className="bg-white p-6 sm:p-8 border-2 border-black space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div>
              <h3 className="font-black text-black text-base sm:text-lg uppercase tracking-wider">
                {isCreating ? '➕ สร้างแผนผ่อนชำระใหม่' : '✏️ แก้ไขแผนผ่อนชำระ'}
              </h3>
              <p className="text-xs text-gray-500">กำหนดเงื่อนไขคำนวณและดูผลลัพธ์จำลองแบบเรียลไทม์</p>
            </div>
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null); }}
              className="p-1 border border-zinc-300 hover:border-black text-zinc-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  ชื่อแผนผ่อน (Plan Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ผ่อนรายวัน 6 เดือน (180 วัน)"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-bold focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  ความถี่การชำระ (Frequency)
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-semibold focus:bg-white focus:border-black focus:outline-none"
                >
                  <option value="daily">☀️ รายวัน (Daily - 30 วัน/เดือน)</option>
                  <option value="weekly">📅 รายสัปดาห์ (Weekly - 4 สัปดาห์/เดือน)</option>
                  <option value="monthly">🗓️ รายเดือน (Monthly - 1 งวด/เดือน)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  ระยะเวลาสัญญา (เดือน / Months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-bold focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  รูปแบบการคิดเงิน (Markup Type)
                </label>
                <select
                  value={markupType}
                  onChange={(e) => setMarkupType(e.target.value as any)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-bold focus:bg-white focus:border-black focus:outline-none"
                >
                  <option value="percentage">📈 อัตราเปอร์เซ็นต์ (% จากราคาสด)</option>
                  <option value="fixed">💵 ยอดคงที่ (Fixed THB บนราคาสินค้า)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  มูลค่าที่บวกเพิ่ม ({markupType === 'percentage' ? '%' : 'บาท THB'})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={markupValue}
                  onChange={(e) => setMarkupValue(Number(e.target.value))}
                  placeholder={markupType === 'percentage' ? '15' : '500'}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-black text-black focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  ลำดับการแสดงผล (Display Order)
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:col-span-3 pt-2 border-t border-zinc-200">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-xs font-bold text-gray-900">
                    ตั้งเป็นแผนเริ่มต้น (Default Plan - จะเปิดใช้งานอัตโนมัติกับสินค้าใหม่ทุกชิ้น)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-xs font-bold text-gray-900">
                    🟢 เปิดใช้งานแผนนี้
                  </span>
                </label>
              </div>
            </div>

            {/* Live Calculation Output Sandbox for this formula */}
            <div className="p-5 bg-zinc-50 border border-black space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-wider">
                  <Calculator className="w-4 h-4" />
                  <span>ผลการคำนวณจำลองจากราคาสด: ฿{simPrice.toLocaleString()}.-</span>
                </div>
                <div className="text-xs text-zinc-600 font-semibold">
                  จำนวนงวด: <strong>{previewCalc.total_periods} งวด</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 border border-zinc-300">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">ราคาสด</span>
                  <span className="font-bold text-black text-sm">฿{previewCalc.original_price.toLocaleString()}</span>
                </div>
                <div className="bg-white p-3 border border-zinc-300">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">ยอดบวกเพิ่ม ({markupType === 'percentage' ? `${markupValue}%` : `Fixed`})</span>
                  <span className="font-bold text-black text-sm">+฿{previewCalc.markup_amount.toLocaleString()}</span>
                </div>
                <div className="bg-white p-3 border border-zinc-300">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">ยอดรวมผ่อนทั้งสิ้น</span>
                  <span className="font-bold text-black text-sm">฿{previewCalc.total_installment_price.toLocaleString()}</span>
                </div>
                <div className="bg-black text-white p-3 border border-black">
                  <span className="text-zinc-300 block text-[10px] uppercase font-bold">ค่างวดต่อรอบ</span>
                  <span className="font-black text-white text-base">
                    ฿{previewCalc.installment_per_period.toFixed(2)} {previewCalc.period_label}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-zinc-700 bg-white p-3 font-mono whitespace-pre-line border border-zinc-300">
                {previewCalc.copy_text}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingId(null); }}
                className="px-6 py-2.5 border border-black text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-100"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 flex items-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4 text-white" />
                <span>บันทึกแผนผ่อนชำระ</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Installment Plans Table */}
      <div className="bg-white border border-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-black text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">ชื่อแผนผ่อน</th>
                <th className="py-3.5 px-4">ความถี่</th>
                <th className="py-3.5 px-4">ระยะเวลา</th>
                <th className="py-3.5 px-4">จำนวนงวด</th>
                <th className="py-3.5 px-4">อัตราบวกเพิ่ม (Markup)</th>
                <th className="py-3.5 px-4">ค่าเริ่มต้น (Default)</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4 text-right">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {plans.map((p) => {
                const totalPeriods = p.frequency === 'daily' ? p.duration_months * 30 : p.frequency === 'weekly' ? p.duration_months * 4 : p.duration_months;

                return (
                  <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-bold text-black block">{p.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">ID: {p.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="border border-zinc-300 font-bold px-2.5 py-1 text-xs text-black uppercase">
                        {getFrequencyThaiLabel(p.frequency)}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-black">{p.duration_months} เดือน</td>
                    <td className="py-4 px-4 font-semibold text-zinc-700">{totalPeriods} งวด</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-black bg-zinc-100 px-2 py-1 border border-zinc-300">
                        +{p.markup_value}{p.markup_type === 'percentage' ? '%' : ' บาท'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {p.is_default ? (
                        <span className="bg-black text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5">
                          Default
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        p.is_active ? 'bg-zinc-100 text-black border border-black' : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        {p.is_active ? 'เปิดใช้งาน' : 'ปิด'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors"
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
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
    </div>
  );
}
