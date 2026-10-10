'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product, InstallmentPlan, InstallmentMode, ProductStatus } from '@/types';
import { useStore } from '@/lib/store';
import { calculateInstallment } from '@/lib/installmentEngine';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  Layers,
  Percent,
  Search,
  Globe,
  UploadCloud
} from 'lucide-react';
import { UploadDropzone, UploadButton } from '@/lib/uploadthing';

interface Props {
  initialProduct?: Product;
  isNew?: boolean;
}

export default function ProductForm({ initialProduct, isNew = false }: Props) {
  const router = useRouter();
  const { products, categories, plans: globalPlans, saveProduct } = useStore();

  const [activeTab, setActiveTab] = useState<'general' | 'images' | 'installment' | 'seo'>('general');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State
  const [sku, setSku] = useState(initialProduct?.sku || `CX00${products.length + 1}`);
  const [name, setName] = useState(initialProduct?.name || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || '');
  const [originalPrice, setOriginalPrice] = useState<number>(initialProduct?.original_price || 5000);
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || 'published');

  // Images State
  const [images, setImages] = useState<string[]>(initialProduct?.images || [
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Installment Mode State
  const [installmentMode, setInstallmentMode] = useState<InstallmentMode>(
    initialProduct?.installment_mode || 'default'
  );
  const [customPlanIds, setCustomPlanIds] = useState<string[]>(
    initialProduct?.custom_plan_ids || globalPlans.filter(p => p.is_default).map(p => p.id)
  );
  const [overridePlans, setOverridePlans] = useState<InstallmentPlan[]>(
    initialProduct?.override_plans || []
  );

  // SEO State
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialProduct?.seo_description || '');
  const [seoKeywords, setSeoKeywords] = useState(initialProduct?.seo_keywords || '');
  const [ogImage, setOgImage] = useState(initialProduct?.og_image || '');

  // Auto slug generation from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (isNew && !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generated || `product-${Date.now().toString().slice(-4)}`);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // SKU unique validation
    const duplicateSku = products.find(
      p => p.sku.trim().toLowerCase() === sku.trim().toLowerCase() && p.id !== initialProduct?.id
    );
    if (duplicateSku) {
      setError(`รหัสสินค้า (SKU) "${sku}" มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่นที่ไม่ซ้ำกัน`);
      return;
    }

    if (!name.trim()) {
      setError('กรุณากรอกชื่อสินค้า');
      return;
    }

    if (!slug.trim()) {
      setError('กรุณากรอก Slug URL');
      return;
    }

    const catObj = categories.find(c => c.id === categoryId);

    const productPayload: Product = {
      id: initialProduct?.id || `prod-${Date.now()}`,
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      brand: brand.trim() || 'Brand',
      slug: slug.trim().toLowerCase(),
      category_id: categoryId,
      category_name: catObj?.name || '',
      original_price: Number(originalPrice) || 0,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800'],
      description: description.trim(),
      status,
      installment_mode: installmentMode,
      custom_plan_ids: customPlanIds,
      override_plans: overridePlans,
      seo_title: seoTitle || `${name} - ผ่อนน้ำหอมแท้ | Yourpickpay`,
      seo_description: seoDescription || `${name} ของแท้ 100% ผ่อนสบายรายวัน รายเดือน`,
      seo_keywords: seoKeywords,
      og_image: ogImage || images[0] || '',
      sale_page_blocks: initialProduct?.sale_page_blocks || [
        {
          id: `hero-${Date.now()}`,
          type: 'hero_heading',
          config: {
            title: name,
            subtitle: 'สัมผัสความหอมระดับเคาน์เตอร์แบรนด์ ผ่อนสบายได้ทุกวัน',
            align: 'center',
            paddingY: 'md'
          }
        },
        {
          id: `calc-${Date.now()}`,
          type: 'calculator_widget',
          config: {
            title: 'เครื่องคำนวณและเลือกแผนผ่อนชำระ',
            showCalculatorDetails: true,
            paddingY: 'md'
          }
        }
      ],
      created_at: initialProduct?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveProduct(productPayload);
    setSuccess(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 600);
  };

  // Preview simulation
  const applicablePreviewPlans = useMemo(() => {
    if (installmentMode === 'override' && overridePlans.length > 0) return overridePlans;
    if (installmentMode === 'custom') {
      const set = new Set(customPlanIds);
      return globalPlans.filter(p => set.has(p.id));
    }
    return globalPlans.filter(p => p.is_default);
  }, [installmentMode, customPlanIds, overridePlans, globalPlans]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
              {isNew ? 'เพิ่มสินค้าใหม่ (Create Product)' : `แก้ไขสินค้า: ${initialProduct?.name}`}
            </h1>
            <p className="text-xs text-gray-500">กำหนดข้อมูล SKU ราคาสด แผนผ่อนชำระ และ Sale Page</p>
          </div>
        </div>

        {initialProduct && (
          <button
            type="button"
            onClick={() => router.push(`/admin/sale-page-builder/${initialProduct.id}`)}
            className="px-3.5 py-2 rounded-xl bg-gold-500 text-brand-950 font-bold text-xs hover:bg-gold-600 flex items-center gap-1.5 shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>เข้าสู่ Sale Page Builder</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-700 flex items-center gap-2">
          <Check className="w-5 h-5 shrink-0" />
          <span>บันทึกข้อมูลสินค้าสำเร็จแล้ว! กำลังกลับสู่หน้ารายการ...</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { id: 'general', label: '1. ข้อมูลทั่วไป (General)' },
          { id: 'images', label: '2. รูปภาพสินค้า (Images)' },
          { id: 'installment', label: '3. แผนการผ่อนชำระ (Installment Plans)' },
          { id: 'seo', label: '4. ข้อมูล SEO & Meta' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-brand-900 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 rounded-2xl border border-brand-200/70 shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  รหัสสินค้า (SKU) <span className="text-rose-500">*ต้องไม่ซ้ำ</span>
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="เช่น CX001, CX002"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold text-brand-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  แบรนด์สินค้า (Brand) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="เช่น Dior, Chanel, Creed, YSL"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                ชื่อสินค้า (Product Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="เช่น Dior Sauvage Eau de Parfum 100ml"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  หมวดหมู่ (Category)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  ราคาสดเคาน์เตอร์ปกติ (THB) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  placeholder="5200"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  สถานะการแสดงผล (Status)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="published">🟢 เผยแพร่ (Published)</option>
                  <option value="draft">🟡 แบบร่าง (Draft)</option>
                  <option value="archived">⚪ เก็บถาวร (Archived)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Slug URL (Unique Path) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-r-0 border-gray-200 px-3 py-2.5 text-xs text-gray-500 rounded-l-xl">
                  /product/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="dior-sauvage-edp"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                รายละเอียดสินค้า (Product Description)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ระบุเรื่องราว ความรู้สึก และจุดเด่นของสินค้า..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Images */}
        {activeTab === 'images' && (
          <div className="bg-white p-6 rounded-2xl border border-brand-200/70 shadow-sm space-y-6">
            {/* UploadThing Dropzone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                อัปโหลดรูปภาพผ่าน UploadThing (Cloud Storage)
              </label>
              <div className="border-2 border-dashed border-zinc-300 p-4 bg-zinc-50 flex flex-col items-center justify-center">
                <UploadDropzone
                  endpoint="productImage"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const newUrls = res.map((f) => f.url);
                      setImages((prev) => [...prev, ...newUrls]);
                      alert(`อัปโหลดสำเร็จ ${res.length} รูปภาพ!`);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`เกิดข้อผิดพลาดในการอัปโหลด: ${error.message}`);
                  }}
                  appearance={{
                    button: "bg-black text-white px-4 py-2 text-xs font-bold uppercase",
                    container: "w-full border-none p-2",
                  }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                หรือเพิ่ม URL รูปภาพภายนอกโดยตรง
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/brand-photo.jpg"
                  className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2.5 bg-brand-800 text-white font-semibold text-xs rounded-xl hover:bg-brand-900 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มรูปภาพ</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
                รูปภาพของสินค้านี้ ({images.length} รูป)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 group">
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-brand-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        รูปหลัก (Cover)
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="ลบรูปภาพนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Installment Plans Configuration */}
        {activeTab === 'installment' && (
          <div className="bg-white p-6 rounded-2xl border border-brand-200/70 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                โหมดการผ่อนชำระสำหรับสินค้านี้ (Installment Mode)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'default', title: 'ใช้แผนผ่อนมาตรฐาน (Default)', desc: 'ใช้แผนที่เป็น Default ทั้งหมดโดยอัตโนมัติ' },
                  { id: 'custom', title: 'เลือกเฉพาะบางแผน (Custom)', desc: 'เลือกเฉพาะแผนที่ต้องการเปิดให้สินค้านี้' },
                  { id: 'override', title: 'กำหนดแผนเฉพาะสินค้านี้ (Override)', desc: 'ปรับแต่งดอกเบี้ยและระยะเวลาเฉพาะสินค้านี้' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setInstallmentMode(mode.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      installmentMode === mode.id
                        ? 'border-brand-600 bg-brand-50/80 shadow-sm ring-2 ring-brand-500/20'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">{mode.title}</div>
                    <div className="text-[11px] text-gray-500 mt-1">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Plan Selector Checkboxes */}
            {installmentMode === 'custom' && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  เลือกแผนผ่อนที่เปิดให้สินค้านี้:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {globalPlans.map((plan) => {
                    const checked = customPlanIds.includes(plan.id);
                    return (
                      <label
                        key={plan.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          checked ? 'bg-brand-50 border-brand-300' : 'bg-white border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomPlanIds([...customPlanIds, plan.id]);
                            } else {
                              setCustomPlanIds(customPlanIds.filter(id => id !== plan.id));
                            }
                          }}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <div>
                          <div className="font-bold text-xs text-gray-900">{plan.name}</div>
                          <div className="text-[10px] text-gray-500">
                            บวกเพิ่ม +{plan.markup_value}{plan.markup_type === 'percentage' ? '%' : ' THB'}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live simulation of plans for this product */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
                พรีวิวการคำนวณค่างวดสำหรับสินค้านี้ (คำนวณจากราคาสด ฿{originalPrice.toLocaleString()}.-)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {applicablePreviewPlans.map((p) => {
                  const calc = calculateInstallment(originalPrice, p, { sku, name });
                  return (
                    <div key={p.id} className="p-3.5 bg-brand-50/50 rounded-xl border border-brand-200 text-xs space-y-1">
                      <div className="font-bold text-gray-900">{p.name}</div>
                      <div className="text-brand-800 font-extrabold text-sm">
                        ฿{calc.installment_per_period.toFixed(2)} {calc.period_label}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        ยอดรวม: ฿{calc.total_installment_price.toLocaleString()} ({calc.total_periods} งวด)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: SEO Metadata */}
        {activeTab === 'seo' && (
          <div className="bg-white p-6 rounded-2xl border border-brand-200/70 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`${name || 'ชื่อสินค้า'} - ผ่อนสินค้าแบรนด์เนมแท้เริ่มต้นหลักสิบบาท | Yourpickpay`}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="ผ่อนสินค้าแบรนด์เนมของแท้เคาน์เตอร์ 100% รายวัน รายสัปดาห์ รายเดือน อนุมัติไว..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                SEO Keywords (คั่นด้วยจุลภาค)
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="ผ่อนแบรนด์เนม, แบรนด์เนมแท้ผ่อนได้"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                OpenGraph Share Image URL
              </label>
              <input
                type="url"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://example.com/og-image.jpg"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-950 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-400" />
            <span>บันทึกข้อมูลสินค้า (Save Product)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
