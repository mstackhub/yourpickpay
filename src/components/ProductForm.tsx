'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product, InstallmentPlan, InstallmentMode, ProductStatus } from '@/types';
import { useStore } from '@/lib/store';
import { calculateInstallment, getFrequencyThaiLabel } from '@/lib/installmentEngine';
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
  UploadCloud,
  FolderOpen,
  Star,
  ArrowRight
} from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';

interface Props {
  initialProduct?: Product;
  isNew?: boolean;
}

export default function ProductForm({ initialProduct, isNew = false }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { products, categories, plans: globalPlans, saveProduct } = useStore();

  const [activeTab, setActiveTab] = useState<'general' | 'images' | 'installment' | 'seo'>('general');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isProcessingLocal, setIsProcessingLocal] = useState(false);

  // Form State
  const [sku, setSku] = useState(initialProduct?.sku || `CX00${products.length + 1}`);
  const [name, setName] = useState(initialProduct?.name || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || '');
  const [originalPrice, setOriginalPrice] = useState<number>(initialProduct?.original_price || 0);
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || 'published');

  // Images State
  const [images, setImages] = useState<string[]>(initialProduct?.images || []);
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

  // Local File Upload Handler with Auto-Compression
  const handleLocalFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessingLocal(true);
    setError('');

    const fileArray = Array.from(files);
    let loadedCount = 0;

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        loadedCount++;
        if (loadedCount === fileArray.length) setIsProcessingLocal(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round(height * (MAX_WIDTH / width));
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round(width * (MAX_HEIGHT / height));
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.85);
              setImages((prev) => [...prev, compressed]);
            } else {
              setImages((prev) => [...prev, event.target?.result as string]);
            }
          } catch (e) {
            setImages((prev) => [...prev, event.target?.result as string]);
          } finally {
            loadedCount++;
            if (loadedCount === fileArray.length) {
              setIsProcessingLocal(false);
            }
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === fileArray.length) setIsProcessingLocal(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
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

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([target, ...rest]);
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
      seo_title: seoTitle || `${name} - ผ่อนสินค้าแบรนด์เนมแท้ | Yourpickpay`,
      seo_description: seoDescription || `${name} ของแท้ 100% ผ่อนสบายรายวัน รายเดือน`,
      seo_keywords: seoKeywords,
      og_image: ogImage || images[0] || '',
      sale_page_blocks: initialProduct?.sale_page_blocks || [
        {
          id: `hero-${Date.now()}`,
          type: 'hero_heading',
          config: {
            title: name,
            subtitle: 'ผ่อนสินค้าแบรนด์เนมแท้ 100% รายวัน รายเดือน อนุมัติไว',
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
    }, 800);
  };

  const handleSelectInstallmentMode = (mode: InstallmentMode) => {
    setInstallmentMode(mode);
    if (mode === 'override' && overridePlans.length === 0) {
      setOverridePlans(
        globalPlans.map((p) => ({
          ...p,
          markup_type: p.markup_type || 'percentage',
          markup_value: p.markup_value,
          is_active: p.is_default,
        }))
      );
    }
  };

  const handleUpdateOverridePlan = (id: string, updates: Partial<InstallmentPlan>) => {
    setOverridePlans((prev) => {
      const base = prev.length > 0 ? prev : globalPlans.map(p => ({ ...p, markup_type: p.markup_type || 'percentage', is_active: p.is_default }));
      return base.map((p) => (p.id === id ? { ...p, ...updates } : p));
    });
  };

  const applicablePreviewPlans = useMemo(() => {
    if (installmentMode === 'override') {
      const activeOverrides = (overridePlans.length > 0 ? overridePlans : globalPlans).filter(p => p.is_active);
      return activeOverrides;
    }
    if (installmentMode === 'custom') {
      return globalPlans.filter(p => customPlanIds.includes(p.id) && p.is_active);
    }
    return globalPlans.filter(p => p.is_default && p.is_active);
  }, [installmentMode, overridePlans, customPlanIds, globalPlans]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              {isNew ? 'เพิ่มสินค้าใหม่ (New Product)' : `แก้ไขสินค้า: ${name || initialProduct?.name}`}
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              กำหนดรายละเอียดสินค้า ราคาเงินสด เงื่อนไขการผ่อน และรูปภาพ
            </p>
          </div>
        </div>

        {initialProduct && (
          <button
            type="button"
            onClick={() => router.push(`/admin/sale-page-builder/${initialProduct.id}`)}
            className="px-4 py-2 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 flex items-center gap-1.5 shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>เข้าสู่ Sale Page Builder</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-black text-white text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-5 h-5 shrink-0 text-white" />
          <span>บันทึกข้อมูลสินค้าสำเร็จแล้ว! กำลังกลับสู่หน้ารายการ...</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-black overflow-x-auto">
        {[
          { id: 'general', label: '1. ข้อมูลทั่วไป (General)' },
          { id: 'images', label: `2. รูปภาพสินค้า (Images) [${images.length}]` },
          { id: 'installment', label: '3. แผนการผ่อนชำระ (Installments)' },
          { id: 'seo', label: '4. ข้อมูล SEO & Meta' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shrink-0 border-t border-l border-r ${
              activeTab === tab.id
                ? 'bg-black text-white border-black'
                : 'bg-zinc-100 text-gray-700 hover:bg-zinc-200 border-transparent'
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
          <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  รหัสสินค้า (SKU) <span className="text-red-500">*ต้องไม่ซ้ำ</span>
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="เช่น CX001, CX002"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-mono font-bold text-black focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  แบรนด์สินค้า (Brand) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="เช่น Dior, Chanel, Rolex, Louis Vuitton, YSL"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-medium focus:bg-white focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                ชื่อสินค้า (Product Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="เช่น Dior Sauvage Eau de Parfum 100ml"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-medium focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  หมวดหมู่ (Category)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-medium focus:bg-white focus:border-black focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  ราคาสดเคาน์เตอร์ปกติ (THB) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={originalPrice || ''}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  placeholder="เช่น 5200"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-bold text-black focus:bg-white focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  สถานะการแสดงผล (Status)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-medium focus:bg-white focus:border-black focus:outline-none"
                >
                  <option value="published">🟢 เผยแพร่ (Published)</option>
                  <option value="draft">🟡 แบบร่าง (Draft)</option>
                  <option value="archived">⚪ เก็บถาวร (Archived)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Slug URL (Unique Path) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="bg-zinc-100 border border-r-0 border-zinc-300 px-4 py-3 text-xs text-gray-600 font-mono">
                  /product/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="dior-sauvage-edp"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm font-mono focus:bg-white focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                รายละเอียดสินค้า (Product Description)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ระบุเรื่องราว ความรู้สึก และจุดเด่นของสินค้า..."
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-zinc-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className="px-5 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 flex items-center gap-2"
              >
                <span>ถัดไป: อัปโหลดรูปภาพสินค้า</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Images */}
        {activeTab === 'images' && (
          <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-8">
            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLocalFiles(e.target.files || [])}
            />

            {/* Option 1: Native Local File Drag & Drop (Highest Reliability) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                  1. เลือกรูปภาพจากเครื่องคอมพิวเตอร์ / มือถือ (Local Photo Upload)
                </label>
                <span className="text-[11px] text-zinc-500 font-medium">รองรับ JPG, PNG, WEBP หลายรูปพร้อมกัน</span>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleLocalFiles(e.dataTransfer.files);
                  }
                }}
                className="border-2 border-dashed border-black p-8 bg-zinc-50 hover:bg-zinc-100 cursor-pointer text-center transition-colors flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center">
                  <FolderOpen className="w-7 h-7" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm mb-2"
                  >
                    📁 คลิกเพื่อเลือกไฟล์รูปภาพจากเครื่อง
                  </button>
                  <p className="text-xs text-zinc-600 font-medium">
                    หรือลากไฟล์รูปภาพมาวางที่นี่ได้ทันที (Drag & Drop)
                  </p>
                </div>
                {isProcessingLocal && (
                  <p className="text-xs text-black font-bold animate-pulse">
                    กำลังประมวลผลรูปภาพ...
                  </p>
                )}
              </div>
            </div>

            {/* Option 2: Cloud Storage UploadThing */}
            <div className="pt-6 border-t border-zinc-200 space-y-3">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                2. หรืออัปโหลดผ่าน UploadThing (Cloud Storage)
              </label>
              <div className="border border-zinc-200 p-4 bg-zinc-50">
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
                    console.error('UploadThing error:', error);
                    // Inform nicely without breaking
                    alert(`Upload error: ${error.message} - คุณสามารถใช้ตัวเลือกที่ 1 (เลือกรูปจากเครื่อง) เพื่อใส่รูปได้ทันทีครับ`);
                  }}
                  appearance={{
                    button: "bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none",
                    container: "w-full border-none p-2",
                  }}
                />
              </div>
            </div>

            {/* Option 3: External URL */}
            <div className="pt-6 border-t border-zinc-200 space-y-2">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                3. หรือเพิ่มจาก URL รูปภาพภายนอกโดยตรง
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-... หรือ URL อื่นๆ"
                  className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มรูปภาพ</span>
                </button>
              </div>
            </div>

            {/* Image Preview Grid */}
            <div className="pt-6 border-t border-zinc-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  รูปภาพของสินค้านี้ ({images.length} รูป)
                </span>
                {images.length > 0 && (
                  <span className="text-[11px] text-zinc-500 font-medium">
                    *รูปแรกซ้ายสุดคือ "รูปหน้าปก (Cover Image)" ของสินค้า
                  </span>
                )}
              </div>

              {images.length === 0 ? (
                <div className="p-8 border border-zinc-200 text-center text-zinc-400 text-xs">
                  ยังไม่มีรูปภาพ กรุณาเลือกรูปภาพจากเครื่องคอมพิวเตอร์ด้านบน
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square border border-black overflow-hidden bg-zinc-100 group">
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {idx === 0 ? (
                        <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-black px-2 py-1 uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-white" />
                          <span>รูปหน้าปก (Cover)</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCoverImage(idx)}
                          className="absolute bottom-2 left-2 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2 py-1 transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          ตั้งเป็นรูปหน้าปก
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white shadow-md transition-opacity opacity-0 group-hover:opacity-100"
                        title="ลบรูปภาพนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Installment Plans Configuration */}
        {activeTab === 'installment' && (
          <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                โหมดการผ่อนชำระสำหรับสินค้านี้ (Installment Mode)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'default', title: 'ใช้แผนผ่อนมาตรฐาน (Default)', desc: 'ใช้แผนที่เป็น Default ส่วนกลางทั้งหมดโดยอัตโนมัติ' },
                  { id: 'custom', title: 'เลือกเฉพาะบางแผน (Custom)', desc: 'เลือกเฉพาะแผนที่ต้องการเปิดให้สินค้านี้' },
                  { id: 'override', title: 'กำหนดแผนเฉพาะสินค้านี้ (Override)', desc: 'กำหนด % หรือระบุ Fixed บาท แยกรายแผนสำหรับสินค้านี้' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleSelectInstallmentMode(mode.id as any)}
                    className={`p-4 border text-left transition-all ${
                      installmentMode === mode.id
                        ? 'border-black bg-black text-white'
                        : 'border-zinc-300 bg-white text-black hover:border-black'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm">{mode.title}</div>
                    <div className={`text-[11px] mt-1 ${installmentMode === mode.id ? 'text-zinc-300' : 'text-gray-500'}`}>
                      {mode.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Plan Selector Checkboxes */}
            {installmentMode === 'custom' && (
              <div className="p-5 bg-zinc-50 border border-zinc-300 space-y-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                  เลือกแผนผ่อนที่เปิดให้สินค้านี้:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {globalPlans.map((plan) => {
                    const checked = customPlanIds.includes(plan.id);
                    return (
                      <label
                        key={plan.id}
                        className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-all ${
                          checked ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-300'
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
                          className="w-4 h-4 accent-black"
                        />
                        <div>
                          <div className="font-bold text-xs">{plan.name}</div>
                          <div className={`text-[10px] ${checked ? 'text-zinc-300' : 'text-gray-500'}`}>
                            บวกเพิ่ม +{plan.markup_value}{plan.markup_type === 'percentage' ? '%' : ' บาท'}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Override Plan Editor Table */}
            {installmentMode === 'override' && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                    กำหนดเงื่อนไขผ่อนเฉพาะสินค้านี้ (Override Plans):
                  </span>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    เลือกว่าจะคิดแบบ % หรือ ยอดคงที่ (Fixed บาท) แยกรายแผนได้
                  </span>
                </div>

                <div className="border border-black overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black text-white font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-3 w-12 text-center">เปิดใช้</th>
                          <th className="py-3 px-3">ชื่อแผนผ่อน</th>
                          <th className="py-3 px-3">ความถี่</th>
                          <th className="py-3 px-3 w-40">รูปแบบคิดเงิน</th>
                          <th className="py-3 px-3 w-32">มูลค่าบวกเพิ่ม</th>
                          <th className="py-3 px-3 text-right">ค่างวดต่อรอบ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {(overridePlans.length > 0 ? overridePlans : globalPlans).map((plan) => {
                          const currentPlan = overridePlans.find(p => p.id === plan.id) || plan;
                          const isPlanActive = Boolean(currentPlan.is_active);
                          const calc = calculateInstallment(originalPrice || 0, currentPlan, { sku, name });

                          return (
                            <tr key={plan.id} className={isPlanActive ? 'bg-white hover:bg-zinc-50' : 'bg-zinc-100 opacity-60'}>
                              <td className="py-3 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isPlanActive}
                                  onChange={(e) => handleUpdateOverridePlan(plan.id, { is_active: e.target.checked })}
                                  className="w-4 h-4 accent-black"
                                />
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-bold text-black block">{plan.name}</span>
                                <span className="text-[10px] text-zinc-400 font-mono">{plan.duration_months} เดือน</span>
                              </td>
                              <td className="py-3 px-3">
                                <span className="border border-zinc-300 font-bold px-2 py-0.5 text-[10px] text-black uppercase">
                                  {getFrequencyThaiLabel(plan.frequency)}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <select
                                  disabled={!isPlanActive}
                                  value={currentPlan.markup_type || 'percentage'}
                                  onChange={(e) => handleUpdateOverridePlan(plan.id, { markup_type: e.target.value as any })}
                                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 text-xs font-bold text-black focus:outline-none focus:border-black disabled:bg-zinc-200"
                                >
                                  <option value="percentage">% เปอร์เซ็นต์</option>
                                  <option value="fixed">บาท (Fixed THB)</option>
                                </select>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    disabled={!isPlanActive}
                                    value={currentPlan.markup_value}
                                    onChange={(e) => handleUpdateOverridePlan(plan.id, { markup_value: Number(e.target.value) || 0 })}
                                    className="w-20 px-2 py-1.5 bg-zinc-50 border border-zinc-300 text-xs font-black text-black focus:outline-none focus:border-black disabled:bg-zinc-200"
                                  />
                                  <span className="text-[10px] font-bold text-zinc-600">
                                    {currentPlan.markup_type === 'fixed' ? '฿' : '%'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <span className="font-black text-xs text-black block">
                                  ฿{calc.installment_per_period.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-zinc-500">
                                  {calc.period_label} (รวม ฿{calc.total_installment_price.toLocaleString()})
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Live simulation of plans for this product */}
            <div className="pt-4 border-t border-zinc-200">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-3">
                พรีวิวการคำนวณค่างวดสำหรับสินค้านี้ (คำนวณจากราคาสด ฿{originalPrice.toLocaleString()}.-)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {applicablePreviewPlans.map((p) => {
                  const calc = calculateInstallment(originalPrice, p, { sku, name });
                  return (
                    <div key={p.id} className="p-4 bg-zinc-50 border border-zinc-300 text-xs space-y-1">
                      <div className="font-bold text-black">{p.name}</div>
                      <div className="text-black font-black text-base">
                        ฿{calc.installment_per_period.toFixed(2)} {calc.period_label}
                      </div>
                      <div className="text-[10px] text-zinc-500">
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
          <div className="bg-white p-6 sm:p-8 border border-zinc-200 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`${name || 'ชื่อสินค้า'} - ผ่อนสินค้าแบรนด์เนมแท้เริ่มต้นหลักสิบบาท | Yourpickpay`}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="ผ่อนสินค้าแบรนด์เนมของแท้เคาน์เตอร์ 100% รายวัน รายสัปดาห์ รายเดือน อนุมัติไว..."
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                SEO Keywords (คั่นด้วยจุลภาค)
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="ผ่อนแบรนด์เนม, แบรนด์เนมแท้ผ่อนได้"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                OpenGraph Share Image URL
              </label>
              <input
                type="url"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://example.com/og-image.jpg"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-sm focus:bg-white focus:border-black focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-black">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-transform active:scale-[0.99]"
          >
            <Save className="w-4 h-4 text-white" />
            <span>บันทึกข้อมูลสินค้า (Save Product)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
