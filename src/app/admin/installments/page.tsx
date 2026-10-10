'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { InstallmentPlan, InstallmentFrequency, MarkupType } from '@/types';
import { calculateInstallment } from '@/lib/installmentEngine';
import { 
  Percent, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Calculator, 
  Calendar,
  Layers
} from 'lucide-react';

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
  const [simPrice, setSimPrice] = useState<number>(5200);

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
    setMarkupType(plan.markup_type);
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
      sku: 'CX001',
      name: 'Dior Sauvage'
    });
  }, [simPrice, currentPlanPreview]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
            เงื่อนไขการผ่อนชำระ (Installment Plans)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            กำหนดระยะเวลา ความถี่ อัตราบวกเพิ่ม (Markup) และแผนเริ่มต้นสำหรับสินค้าใหม่
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2.5 bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างแผนผ่อนใหม่</span>
          </button>
        )}
      </div>

      {/* Inline Create / Edit Form with Live Engine Tester */}
      {(isCreating || editingId) && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-brand-500 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                {isCreating ? '➕ สร้างแผนผ่อนชำระใหม่' : '✏️ แก้ไขแผนผ่อนชำระ'}
              </h3>
              <p className="text-xs text-gray-500">ปรับแต่งสูตรคำนวณและดูผลลัพธ์แบบเรียลไทม์</p>
            </div>
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  ชื่อแผนผ่อน (Plan Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ผ่อนรายวัน 6 เดือน (180 วัน)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  ความถี่การชำระ (Frequency)
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="daily">☀️ รายวัน (Daily - 30 วัน/เดือน)</option>
                  <option value="weekly">📅 รายสัปดาห์ (Weekly - 4 สัปดาห์/เดือน)</option>
                  <option value="monthly">🗓️ รายเดือน (Monthly - 1 งวด/เดือน)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  ระยะเวลาสัญญา (เดือน / Months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  รูปแบบยอดบวกเพิ่ม (Markup Type)
                </label>
                <select
                  value={markupType}
                  onChange={(e) => setMarkupType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="percentage">📈 อัตราเปอร์เซ็นต์ (% จากราคาสด)</option>
                  <option value="fixed">💵 ยอดคงที่ (บาท Fixed Amount)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  มูลค่าที่บวกเพิ่ม ({markupType === 'percentage' ? '%' : 'บาท'})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={markupValue}
                  onChange={(e) => setMarkupValue(Number(e.target.value))}
                  placeholder={markupType === 'percentage' ? '15' : '500'}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-700 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  ลำดับการแสดงผล (Display Order)
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    ตั้งเป็นแผนเริ่มต้น (Default Plan สำหรับสินค้าใหม่ทุกชิ้น)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    🟢 เปิดใช้งานแผนนี้
                  </span>
                </label>
              </div>
            </div>

            {/* Live Calculation Output Sandbox for this formula */}
            <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-900 font-bold text-xs sm:text-sm">
                  <Calculator className="w-4 h-4 text-brand-600" />
                  <span>ผลการคำนวณสดจากราคาสดตัวอย่าง: ฿{simPrice.toLocaleString()}.-</span>
                </div>
                <div className="text-[11px] text-gray-500">
                  จำนวนงวดคำนวณได้: <strong>{previewCalc.total_periods} งวด</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">ราคาสด</span>
                  <span className="font-bold text-gray-900">฿{previewCalc.original_price.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">ยอดบวกเพิ่ม</span>
                  <span className="font-bold text-brand-700">+฿{previewCalc.markup_amount.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">ยอดรวมทั้งสิ้น</span>
                  <span className="font-bold text-brand-950">฿{previewCalc.total_installment_price.toLocaleString()}</span>
                </div>
                <div className="bg-brand-900 text-white p-2.5 rounded-xl">
                  <span className="text-gold-300 block text-[10px]">ค่างวด</span>
                  <span className="font-black text-gold-400 text-sm">
                    ฿{previewCalc.installment_per_period.toFixed(2)} {previewCalc.period_label}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 bg-white/80 p-2.5 rounded-xl font-mono whitespace-pre-line border border-brand-100">
                {previewCalc.copy_text}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingId(null); }}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-900 text-white font-bold text-xs sm:text-sm hover:bg-brand-950 flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4 text-gold-400" />
                <span>บันทึกแผนผ่อนชำระ</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Installment Plans Table */}
      <div className="bg-white rounded-2xl border border-brand-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
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
            <tbody className="divide-y divide-gray-100">
              {plans.map((p) => {
                const totalPeriods = p.frequency === 'daily' ? p.duration_months * 30 : p.frequency === 'weekly' ? p.duration_months * 4 : p.duration_months;

                return (
                  <tr key={p.id} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{p.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-gray-100 font-semibold px-2.5 py-1 rounded-md text-xs text-gray-800 uppercase">
                        {p.frequency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{p.duration_months} เดือน</td>
                    <td className="py-3.5 px-4 font-semibold text-brand-700">{totalPeriods} งวด</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-900 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        +{p.markup_value}{p.markup_type === 'percentage' ? '%' : ' THB'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.is_default ? (
                        <span className="bg-gray-100 text-black font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-gray-300">
                          Default
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.is_active ? 'เปิดใช้งาน' : 'ปิด'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
