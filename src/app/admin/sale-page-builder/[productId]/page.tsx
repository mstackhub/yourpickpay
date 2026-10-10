'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Product, SalePageBlock, BlockType } from '@/types';
import SalePageRenderer from '@/components/SalePageRenderer';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Smartphone, 
  Monitor, 
  Plus, 
  Trash2, 
  Copy, 
  EyeOff, 
  GripVertical, 
  Settings2, 
  ExternalLink,
  Check,
  Layers,
  HelpCircle,
  Video,
  Image as ImageIcon,
  MessageCircle,
  Calculator,
  Type
} from 'lucide-react';

export default function SalePageBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;
  const { products, saveProduct, isLoaded } = useStore();

  const product = products.find(p => p.id === productId || p.slug === productId);

  const [blocks, setBlocks] = useState<SalePageBlock[]>(() => {
    return product?.sale_page_blocks || [];
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(() => {
    return product?.sale_page_blocks?.[0]?.id || null;
  });

  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [status, setStatus] = useState(product?.status || 'published');

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddBlock = (type: BlockType) => {
    const newId = `block-${Date.now()}`;
    let newBlock: SalePageBlock;

    switch (type) {
      case 'hero_heading':
        newBlock = {
          id: newId,
          type: 'hero_heading',
          config: {
            title: product?.name || 'หัวข้อโปรโมชั่นน้ำหอม',
            subtitle: 'สัมผัสความหอมระดับพรีเมียม ผ่อนสบายเริ่มต้นวันละไม่กี่บาท',
            align: 'center',
            paddingY: 'md',
            textColor: '#111827',
          }
        };
        break;
      case 'calculator_widget':
        newBlock = {
          id: newId,
          type: 'calculator_widget',
          config: {
            title: 'เครื่องคำนวณและเลือกแผนผ่อนชำระ',
            subtitle: 'เลือกระยะเวลาและความถี่ที่ตรงกับคุณ',
            showCalculatorDetails: true,
            paddingY: 'md'
          }
        };
        break;
      case 'scent_notes':
        newBlock = {
          id: newId,
          type: 'scent_notes',
          config: {
            title: 'Scent Pyramid โน้ตความหอม',
            scentNotes: {
              topNotes: ['Bergamot', 'Grapefruit'],
              middleNotes: ['Lavender', 'Geranium', 'Pink Pepper'],
              baseNotes: ['Cedarwood', 'Patchouli', 'Vanilla']
            },
            paddingY: 'md'
          }
        };
        break;
      case 'features_list':
        newBlock = {
          id: newId,
          type: 'features_list',
          config: {
            title: 'จุดเด่นและบริการของเรา',
            items: [
              { title: 'ของแท้ 100%', description: 'กล่องซีล เช็คโค้ดได้ทุกขวด' },
              { title: 'ไม่ต้องใช้บัตรเครดิต', description: 'อนุมัติไว ผ่อนได้ทุกอาชีพ' },
              { title: 'ยอดผ่อนชัดเจน', description: 'ไม่มีค่าธรรมเนียมแอบแฝง' },
              { title: 'จัดส่งด่วนฟรี', description: 'แพ็คกันกระแทกอย่างดี' }
            ],
            paddingY: 'md'
          }
        };
        break;
      case 'faq_accordion':
        newBlock = {
          id: newId,
          type: 'faq_accordion',
          config: {
            title: 'คำถามที่พบบ่อย (FAQ)',
            faqs: [
              { question: 'น้ำหอมเป็นของแท้จริงไหม?', answer: 'แท้ 100% แน่นอนครับ ทุกขวดนำเข้าจากเคาน์เตอร์แบรนด์ มีกล่องป้ายครบ เช็คโค้ดได้' },
              { question: 'ขั้นตอนการผ่อนทำอย่างไร?', answer: 'เลือกแผนที่ต้องการ กดคัดลอกรายละเอียด แล้วส่งให้แอดมินทาง LINE ได้เลยครับ' }
            ],
            paddingY: 'md'
          }
        };
        break;
      case 'cta_contact':
        newBlock = {
          id: newId,
          type: 'cta_contact',
          config: {
            title: 'พร้อมเป็นเจ้าของความหอมแล้วหรือยัง?',
            subtitle: 'แอดไลน์เพื่อเช็คสต็อกและเปิดสัญญาผ่อนได้ทันที',
            buttonText: 'ติดต่อแอดมินทาง LINE OA',
            buttonUrl: 'https://line.me',
            paddingY: 'md'
          }
        };
        break;
      case 'image_banner':
        newBlock = {
          id: newId,
          type: 'image_banner',
          config: {
            imageUrl: product?.images?.[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200',
            imageAlt: 'Perfume Banner',
            paddingY: 'md'
          }
        };
        break;
      case 'video_embed':
        newBlock = {
          id: newId,
          type: 'video_embed',
          config: {
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            paddingY: 'md'
          }
        };
        break;
      case 'reviews_grid':
        newBlock = {
          id: newId,
          type: 'reviews_grid',
          config: {
            title: 'เสียงตอบรับจากลูกค้าผู้ใช้งานจริง',
            reviews: [
              { author: 'คุณธนภัทร', rating: 5, comment: 'ผ่อนรายวันสบายมากครับ น้ำหอมแท้แน่นอน กลิ่นทนทั้งวัน' },
              { author: 'คุณวรรณิศา', rating: 5, comment: 'ประทับใจแอดมินมาก ตอบไว ให้คำแนะนำดี ส่งของไวค่ะ' }
            ],
            paddingY: 'md'
          }
        };
        break;
      case 'divider':
        newBlock = {
          id: newId,
          type: 'divider',
          config: {}
        };
        break;
      default:
        newBlock = {
          id: newId,
          type: 'text_content',
          config: {
            title: 'ข้อความรายละเอียด',
            content: 'รายละเอียดเพิ่มเติมสำหรับน้ำหอมรุ่นนี้...',
            paddingY: 'md'
          }
        };
    }

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newId);
  };

  const handleDuplicateBlock = (id: string) => {
    const target = blocks.find(b => b.id === id);
    if (!target) return;
    const clone: SalePageBlock = {
      ...JSON.parse(JSON.stringify(target)),
      id: `block-${Date.now()}`,
    };
    setBlocks([...blocks, clone]);
    setSelectedBlockId(clone.id);
  };

  const handleToggleHideBlock = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, is_hidden: !b.is_hidden } : b));
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleUpdateBlockConfig = (key: string, value: any) => {
    if (!selectedBlockId) return;
    setBlocks(blocks.map(b => {
      if (b.id === selectedBlockId) {
        return {
          ...b,
          config: {
            ...b.config,
            [key]: value
          }
        };
      }
      return b;
    }));
  };

  const handleSavePage = () => {
    if (!product) return;
    const updatedProduct: Product = {
      ...product,
      sale_page_blocks: blocks,
      status: status as any,
      updated_at: new Date().toISOString(),
    };
    saveProduct(updatedProduct);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!isLoaded || !product) {
    return <div className="p-8 text-center text-gray-500">กำลังโหลด Sale Page Builder...</div>;
  }

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="space-y-4">
      {/* Top Builder Control Bar */}
      <div className="bg-brand-950 text-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 sticky top-2 z-30">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/admin/products"
            className="p-2 bg-brand-900 rounded-xl hover:bg-brand-800 text-brand-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block">
              Block-Based Sale Page Builder
            </span>
            <h2 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
              {product.name} ({product.sku})
            </h2>
          </div>
        </div>

        {/* Center: Viewport Switcher */}
        <div className="flex items-center gap-1 bg-brand-900/80 p-1 rounded-xl border border-brand-800">
          <button
            type="button"
            onClick={() => setViewportMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewportMode === 'desktop' ? 'bg-gold-500 text-brand-950 shadow-sm' : 'text-brand-300 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewportMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewportMode === 'mobile' ? 'bg-gold-500 text-brand-950 shadow-sm' : 'text-brand-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right: Save & Live Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-3 py-2 bg-brand-900 border border-brand-800 rounded-xl text-xs text-white font-medium focus:outline-none"
          >
            <option value="published">🟢 Published</option>
            <option value="draft">🟡 Draft</option>
            <option value="archived">⚪ Archived</option>
          </select>

          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="p-2 bg-brand-900 hover:bg-brand-800 text-brand-200 rounded-xl text-xs flex items-center gap-1"
            title="ดูหน้าร้านจริง"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={handleSavePage}
            className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-brand-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'บันทึกแล้ว!' : 'บันทึก Sale Page'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Block Library & Outline (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Add Block Palette */}
          <div className="bg-white rounded-2xl border border-brand-200/70 p-4 shadow-sm space-y-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              ➕ เพิ่มบล็อกเนื้อหา (Add Blocks)
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { type: 'hero_heading', label: 'หัวข้อหลัก', icon: Type },
                { type: 'calculator_widget', label: 'เครื่องคำนวณผ่อน', icon: Calculator },
                { type: 'scent_notes', label: 'พีระมิดกลิ่น', icon: Layers },
                { type: 'features_list', label: 'จุดเด่นสินค้า', icon: Check },
                { type: 'faq_accordion', label: 'คำถามที่พบบ่อย', icon: HelpCircle },
                { type: 'cta_contact', label: 'ปุ่มแอดไลน์ CTA', icon: MessageCircle },
                { type: 'image_banner', label: 'แบนเนอร์รูปภาพ', icon: ImageIcon },
                { type: 'video_embed', label: 'วิดีโอ YouTube', icon: Video },
                { type: 'reviews_grid', label: 'รีวิวลูกค้า', icon: Check },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleAddBlock(item.type as BlockType)}
                    className="p-2 bg-gray-50 hover:bg-brand-50 hover:text-brand-800 text-gray-700 rounded-xl text-left border border-gray-100 flex items-center gap-1.5 font-medium transition-all"
                  >
                    <Icon className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sortable Block Outline List */}
          <div className="bg-white rounded-2xl border border-brand-200/70 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                ลำดับบล็อก ({blocks.length})
              </span>
              <span className="text-[10px] text-gray-400">ลากเพื่อเรียงลำดับ</span>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {blocks.map((block, idx) => (
                    <SortableBlockItem
                      key={block.id}
                      block={block}
                      index={idx}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onDuplicate={() => handleDuplicateBlock(block.id)}
                      onToggleHide={() => handleToggleHideBlock(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                    />
                  ))}
                  {blocks.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400 border border-dashed rounded-xl">
                      ยังไม่มีบล็อก กดเลือกบล็อกด้านบนเพื่อเริ่มต้น
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Middle Column: Live Canvas Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-gray-200 p-4 rounded-3xl min-h-[600px] flex justify-center">
            <div className={`bg-[#FAFAF8] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 w-full ${
              viewportMode === 'mobile' ? 'max-w-sm border-[6px] border-gray-900 rounded-[36px] shadow-2xl' : 'max-w-full'
            }`}>
              {/* Fake Mobile Notch Header if Mobile */}
              {viewportMode === 'mobile' && (
                <div className="bg-gray-900 text-white text-[10px] py-1 px-4 flex items-center justify-between">
                  <span>09:41</span>
                  <div className="w-16 h-3 bg-black rounded-full" />
                  <span>5G 100%</span>
                </div>
              )}

              {/* Canvas Content */}
              <div className="p-2 sm:p-4">
                <SalePageRenderer 
                  product={product} 
                  blocks={blocks} 
                  previewMode={viewportMode} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Block Inspector & Settings (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-brand-200/70 p-4 sm:p-5 shadow-sm space-y-4 sticky top-24">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Settings2 className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wider">
                ตั้งค่าบล็อก (Block Inspector)
              </h3>
            </div>

            {selectedBlock ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    ประเภทบล็อก: {selectedBlock.type}
                  </span>
                </div>

                {/* Common Title & Subtitle */}
                {('title' in selectedBlock.config || selectedBlock.type === 'hero_heading' || selectedBlock.type === 'calculator_widget' || selectedBlock.type === 'features_list' || selectedBlock.type === 'faq_accordion' || selectedBlock.type === 'reviews_grid') && (
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">หัวข้อ (Title)</label>
                    <input
                      type="text"
                      value={selectedBlock.config.title || ''}
                      onChange={(e) => handleUpdateBlockConfig('title', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>
                )}

                {'subtitle' in selectedBlock.config && (
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">คำบรรยายย่อย (Subtitle)</label>
                    <textarea
                      rows={2}
                      value={selectedBlock.config.subtitle || ''}
                      onChange={(e) => handleUpdateBlockConfig('subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>
                )}

                {/* Padding Top/Bottom */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">ระยะห่างแนวตั้ง (Padding Y)</label>
                  <select
                    value={selectedBlock.config.paddingY || 'md'}
                    onChange={(e) => handleUpdateBlockConfig('paddingY', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                  >
                    <option value="none">ไม่มี (0px)</option>
                    <option value="sm">เล็ก (16px)</option>
                    <option value="md">ปานกลาง (32px)</option>
                    <option value="lg">กว้าง (48px)</option>
                    <option value="xl">กว้างมาก (64px)</option>
                  </select>
                </div>

                {/* Text Alignment */}
                {selectedBlock.config.align && (
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">การจัดวางข้อความ (Align)</label>
                    <select
                      value={selectedBlock.config.align}
                      onChange={(e) => handleUpdateBlockConfig('align', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    >
                      <option value="left">ชิดซ้าย (Left)</option>
                      <option value="center">กึ่งกลาง (Center)</option>
                      <option value="right">ชิดขวา (Right)</option>
                    </select>
                  </div>
                )}

                {/* Image Banner URL */}
                {selectedBlock.type === 'image_banner' && (
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">URL รูปภาพแบนเนอร์</label>
                    <input
                      type="url"
                      value={selectedBlock.config.imageUrl || ''}
                      onChange={(e) => handleUpdateBlockConfig('imageUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>
                )}

                {/* Video URL */}
                {selectedBlock.type === 'video_embed' && (
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">URL วิดีโอ YouTube</label>
                    <input
                      type="url"
                      value={selectedBlock.config.videoUrl || ''}
                      onChange={(e) => handleUpdateBlockConfig('videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    />
                  </div>
                )}

                {/* CTA Button Settings */}
                {selectedBlock.type === 'cta_contact' && (
                  <>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">ข้อความบนปุ่ม</label>
                      <input
                        type="text"
                        value={selectedBlock.config.buttonText || ''}
                        onChange={(e) => handleUpdateBlockConfig('buttonText', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">ลิงก์ติดต่อ LINE OA</label>
                      <input
                        type="url"
                        value={selectedBlock.config.buttonUrl || ''}
                        onChange={(e) => handleUpdateBlockConfig('buttonUrl', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </>
                )}

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleHideBlock(selectedBlock.id)}
                    className="text-[11px] text-gray-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    {selectedBlock.is_hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{selectedBlock.is_hidden ? 'แสดงบล็อกนี้' : 'ซ่อนบล็อกนี้'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(selectedBlock.id)}
                    className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบบล็อกนี้</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">
                คลิกเลือกบล็อกที่ต้องการแก้ไขทางด้านซ้าย
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponent for Sortable List Item
function SortableBlockItem({
  block,
  index,
  isSelected,
  onSelect,
  onDuplicate,
  onToggleHide,
  onDelete
}: {
  block: SalePageBlock;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onToggleHide: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
        isSelected
          ? 'bg-brand-50 border-brand-500 shadow-sm ring-1 ring-brand-500'
          : block.is_hidden
          ? 'bg-gray-100 opacity-60 border-gray-200'
          : 'bg-white border-gray-200 hover:border-brand-300'
      }`}
    >
      <div className="flex items-center gap-2 truncate">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          title="ลากเพื่อย้ายตำแหน่ง"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="font-mono text-[10px] text-gray-400 font-bold">#{index + 1}</span>
        <span className="font-semibold text-gray-800 truncate">
          {block.config?.title || block.type}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onToggleHide}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title={block.is_hidden ? 'แสดง' : 'ซ่อน'}
        >
          {block.is_hidden ? <EyeOff className="w-3.5 h-3.5 text-amber-500" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title="ทำซ้ำ"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-rose-600 rounded"
          title="ลบ"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
