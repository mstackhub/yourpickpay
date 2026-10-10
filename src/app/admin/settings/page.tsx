'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { WebsiteSettings, DownPaymentType } from '@/types';
import { 
  Settings, 
  Save, 
  Check, 
  MessageCircle, 
  Phone, 
  Palette, 
  Globe, 
  ShieldCheck,
  RotateCcw,
  Coins
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, saveSettings, resetDefaults } = useStore();

  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [success, setSuccess] = useState(false);

  const handleChange = (key: keyof WebsiteSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('คุณต้องการคืนค่าการตั้งค่าเว็บไซต์กลับเป็นค่าเริ่มต้นหรือไม่?')) {
      resetDefaults();
      setFormData(settings);
    }
  };

  // Simulation for down payment
  const simPrice = 5700;
  const isDpEnabled = Boolean(formData.enable_down_payment);
  const dpType = formData.default_down_payment_type || 'percentage';
  const dpVal = Number(formData.default_down_payment_value) || 0;
  const simDpAmount = isDpEnabled && dpVal > 0 
    ? (dpType === 'percentage' ? Math.round(simPrice * (dpVal / 100)) : Math.min(simPrice, dpVal))
    : 0;
  const simFinanced = Math.max(0, simPrice - simDpAmount);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black pb-4">
        <div>
          <h1 className="font-black text-2xl uppercase tracking-tight text-black">
            ตั้งค่าเว็บไซต์ส่วนกลาง (Website Settings)
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            ปรับแต่งชื่อร้าน ข้อมูลเงินดาวน์เริ่มต้น (Default Down Payment) ข้อมูลติดต่อ LINE OA และ SEO
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>รีเซ็ตการตั้งค่า (Reset)</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-black text-white text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-5 h-5 shrink-0 text-white" />
          <span>บันทึกการตั้งค่าเว็บไซต์เรียบร้อยแล้ว! ข้อมูลจะอัปเดตไปยังระบบทันที</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Down Payment Defaults (NEW) */}
        <div className="bg-white p-6 sm:p-8 border-2 border-black space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-black">
              <Coins className="w-5 h-5 text-black" />
              <span>1. การตั้งค่าเงินดาวน์เริ่มต้น (Default Down Payment Settings)</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              *สินค้าที่เลือกใช้โหมด "Default" จะใช้เงินดาวน์ตามการตั้งค่านี้
            </span>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer select-none p-3.5 bg-zinc-50 border border-zinc-300">
              <input
                type="checkbox"
                checked={Boolean(formData.enable_down_payment)}
                onChange={(e) => handleChange('enable_down_payment', e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              <div>
                <span className="font-bold text-xs sm:text-sm text-black block">
                  เปิดใช้งานการเรียกเก็บเงินดาวน์เป็นค่าเริ่มต้น (Enable Default Down Payment)
                </span>
                <span className="text-[11px] text-zinc-500">
                  หากปิดไว้ สินค้าที่ตั้งค่าเป็น Default จะเป็นแบบ "ฟรีดาวน์ (ดาวน์ 0 บาท)" โดยอัตโนมัติ
                </span>
              </div>
            </label>

            {formData.enable_down_payment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    รูปแบบเงินดาวน์เริ่มต้น (Down Payment Type)
                  </label>
                  <select
                    value={formData.default_down_payment_type || 'percentage'}
                    onChange={(e) => handleChange('default_down_payment_type', e.target.value as DownPaymentType)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-bold text-black focus:bg-white focus:border-black focus:outline-none"
                  >
                    <option value="percentage">📈 อัตราเปอร์เซ็นต์ (% จากราคาสด)</option>
                    <option value="fixed">💵 ยอดคงที่ (Fixed THB เช่น 1,000 บาท)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    มูลค่าเงินดาวน์เริ่มต้น ({formData.default_down_payment_type === 'fixed' ? 'บาท THB' : '%'})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.default_down_payment_value ?? 0}
                      onChange={(e) => handleChange('default_down_payment_value', Number(e.target.value))}
                      placeholder={formData.default_down_payment_type === 'fixed' ? '1000' : '10'}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-black text-black focus:bg-white focus:border-black focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                      {formData.default_down_payment_type === 'fixed' ? 'บาท' : '%'}
                    </span>
                  </div>
                </div>

                {/* Simulation Output */}
                <div className="sm:col-span-2 p-4 bg-zinc-50 border border-zinc-300 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">ราคาสดตัวอย่าง</span>
                    <span className="font-bold text-sm text-black">฿{simPrice.toLocaleString()}.-</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">เงินดาวน์ ({dpType === 'percentage' ? `${dpVal}%` : 'Fixed'})</span>
                    <span className="font-black text-sm text-black">฿{simDpAmount.toLocaleString()}.-</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">ยอดจัดผ่อนคงเหลือ</span>
                    <span className="font-black text-sm text-black">฿{simFinanced.toLocaleString()}.-</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. General Brand Information */}
        <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 font-black text-sm uppercase tracking-wider text-black">
            <Palette className="w-5 h-5 text-black" />
            <span>2. ข้อมูลแบรนด์และชื่อร้าน (Brand Identity)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                ชื่อร้านค้า (Store Name)
              </label>
              <input
                type="text"
                required
                value={formData.store_name}
                onChange={(e) => handleChange('store_name', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-bold focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                โลโก้ URL (Logo URL)
              </label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                สโลแกนร้านค้า (Tagline)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Contact & Social Channels */}
        <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 font-black text-sm uppercase tracking-wider text-black">
            <MessageCircle className="w-5 h-5 text-black" />
            <span>3. ช่องทางติดต่อ LINE OA & โซเชียล (Contact Channels)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                LINE Official Account ID
              </label>
              <input
                type="text"
                value={formData.line_oa_id}
                onChange={(e) => handleChange('line_oa_id', e.target.value)}
                placeholder="@yourpickpay"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                LINE Add Friend URL Link
              </label>
              <input
                type="url"
                value={formData.line_oa_url}
                onChange={(e) => handleChange('line_oa_url', e.target.value)}
                placeholder="https://line.me/R/ti/p/@yourpickpay"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                เบอร์โทรศัพท์ติดต่อ (Phone Number)
              </label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="089-123-4567"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/yourpickpay"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. SEO Defaults & Footer */}
        <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 font-black text-sm uppercase tracking-wider text-black">
            <Globe className="w-5 h-5 text-black" />
            <span>4. ข้อมูล SEO พื้นฐานและที่อยู่ร้านค้า (Default SEO & Footer)</span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Default Meta Title
              </label>
              <input
                type="text"
                value={formData.default_seo_title}
                onChange={(e) => handleChange('default_seo_title', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Default Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.default_seo_description}
                onChange={(e) => handleChange('default_seo_description', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  ที่อยู่ร้านค้า / สำนักงาน
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  ข้อความการันตีท้ายเว็บ (Footer Guarantee Note)
                </label>
                <input
                  type="text"
                  value={formData.footer_note || ''}
                  onChange={(e) => handleChange('footer_note', e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-black">
          <button
            type="submit"
            className="px-8 py-3.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-transform active:scale-[0.99]"
          >
            <Save className="w-4 h-4 text-white" />
            <span>บันทึกการตั้งค่าเว็บไซต์ (Save Settings)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
