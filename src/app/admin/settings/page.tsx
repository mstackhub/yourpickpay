'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { WebsiteSettings } from '@/types';
import { 
  Settings, 
  Save, 
  Check, 
  MessageCircle, 
  Phone, 
  Palette, 
  Globe, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, saveSettings, resetDefaults } = useStore();

  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [success, setSuccess] = useState(false);

  const handleChange = (key: keyof WebsiteSettings, value: string) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
            ตั้งค่าเว็บไซต์ (Website Settings)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ปรับแต่งชื่อร้าน ข้อมูลการติดต่อ LINE OA สีแบรนด์ และข้อมูล SEO พื้นฐาน
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>รีเซ็ตการตั้งค่า (Reset)</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-700 flex items-center gap-2">
          <Check className="w-5 h-5 shrink-0" />
          <span>บันทึกการตั้งค่าเว็บไซต์เรียบร้อยแล้ว! ข้อมูลจะอัปเดตไปยังหน้าร้านทันที</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. General Brand Information */}
        <div className="bg-white p-6 rounded-2xl border border-brand-200/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 font-bold text-sm text-gray-900">
            <Palette className="w-4 h-4 text-brand-600" />
            <span>1. ข้อมูลแบรนด์และชื่อร้าน (Brand Identity)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                ชื่อร้านค้า (Store Name)
              </label>
              <input
                type="text"
                required
                value={formData.store_name}
                onChange={(e) => handleChange('store_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                โลโก้ URL (Logo URL)
              </label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                สโลแกน / คำโปรยหลัก (Tagline)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact & Social Channels */}
        <div className="bg-white p-6 rounded-2xl border border-brand-200/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 font-bold text-sm text-gray-900">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>2. ช่องทางการติดต่อและ LINE OA (Contact Channels)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                LINE OA URL (สำหรับปุ่มติดต่อ) <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.line_oa_url}
                onChange={(e) => handleChange('line_oa_url', e.target.value)}
                placeholder="https://line.me/R/ti/p/@yourpickpay"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                LINE OA ID (แสดงบนเว็บ)
              </label>
              <input
                type="text"
                value={formData.line_oa_id}
                onChange={(e) => handleChange('line_oa_id', e.target.value)}
                placeholder="@yourpickpay"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                เบอร์โทรศัพท์ติดต่อ
              </label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="089-123-4567"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/yourpickpay"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/yourpickpay"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                TikTok URL
              </label>
              <input
                type="url"
                value={formData.tiktok_url || ''}
                onChange={(e) => handleChange('tiktok_url', e.target.value)}
                placeholder="https://tiktok.com/@yourpickpay"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 3. SEO Defaults & Footer */}
        <div className="bg-white p-6 rounded-2xl border border-brand-200/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 font-bold text-sm text-gray-900">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>3. ข้อมูล SEO พื้นฐานและที่อยู่ร้านค้า (Default SEO & Footer)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={formData.default_seo_title}
                onChange={(e) => handleChange('default_seo_title', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.default_seo_description}
                onChange={(e) => handleChange('default_seo_description', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  ที่อยู่ร้านค้า / สำนักงาน
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  ข้อความการันตีท้ายเว็บ (Footer Guarantee Note)
                </label>
                <input
                  type="text"
                  value={formData.footer_note || ''}
                  onChange={(e) => handleChange('footer_note', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-brand-900 hover:bg-brand-950 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-400" />
            <span>บันทึกการตั้งค่าเว็บไซต์ (Save Settings)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
