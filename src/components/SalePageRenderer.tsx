'use client';

import React, { useState } from 'react';
import { Product, SalePageBlock } from '@/types';
import InstallmentCalculatorWidget from './InstallmentCalculatorWidget';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Play 
} from 'lucide-react';

interface Props {
  product: Product;
  blocks?: SalePageBlock[];
  previewMode?: 'desktop' | 'mobile';
}

export default function SalePageRenderer({ product, blocks, previewMode = 'desktop' }: Props) {
  const blocksToRender = (blocks || product.sale_page_blocks || []).filter(b => !b.is_hidden);

  const getPaddingClass = (paddingY?: string) => {
    switch (paddingY) {
      case 'none': return 'py-0';
      case 'sm': return 'py-4';
      case 'md': return 'py-8';
      case 'lg': return 'py-12';
      case 'xl': return 'py-16';
      default: return 'py-8';
    }
  };

  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center items-center';
      case 'right': return 'text-right items-end';
      default: return 'text-left items-start';
    }
  };

  return (
    <div className={`sale-page-content ${previewMode === 'mobile' ? 'max-w-md mx-auto border-x border-gray-200' : 'w-full'}`}>
      {blocksToRender.map((block) => {
        const { config = {} } = block;

        switch (block.type) {
          case 'hero_heading':
            return (
              <div
                key={block.id}
                className={`${getPaddingClass(config.paddingY)} px-4`}
                style={{ backgroundColor: config.bgColor || 'transparent' }}
              >
                <div className={`max-w-4xl mx-auto flex flex-col ${getAlignClass(config.align)}`}>
                  {config.title && (
                    <h2 
                      className="font-black text-2xl sm:text-4xl text-black tracking-tight leading-tight"
                      style={{ color: config.textColor || '#000000' }}
                    >
                      {config.title}
                    </h2>
                  )}
                  {config.subtitle && (
                    <p className="mt-3 text-sm sm:text-lg text-gray-600 max-w-2xl leading-relaxed font-normal">
                      {config.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );

          case 'calculator_widget':
            return (
              <div key={block.id} className={`${getPaddingClass(config.paddingY)} px-4`}>
                <div className="max-w-3xl mx-auto">
                  {config.title && (
                    <div className="text-center mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-black">{config.title}</h3>
                      {config.subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{config.subtitle}</p>
                      )}
                    </div>
                  )}
                  <InstallmentCalculatorWidget product={product} />
                </div>
              </div>
            );

          case 'scent_notes':
            const scent = config.scentNotes || {
              topNotes: ['Calabrian Bergamot', 'Pepper'],
              middleNotes: ['Lavender', 'Sichuan Pepper'],
              baseNotes: ['Ambroxan', 'Cedarwood', 'Vanilla']
            };

            return (
              <div key={block.id} className={`${getPaddingClass(config.paddingY)} px-4`}>
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">
                      Fragrance Architecture
                    </span>
                    <h3 className="font-bold text-xl sm:text-2xl text-black">
                      {config.title || 'พีระมิดโน้ตความหอม (Scent Notes)'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Top Notes */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">1</span>
                        <h4 className="font-bold text-black text-sm">Top Notes (กลิ่นเปิด)</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-3">5-15 นาทีแรกหลังฉีด</p>
                      <div className="flex flex-wrap gap-1.5">
                        {scent.topNotes?.map((note: string, i: number) => (
                          <span key={i} className="bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-black border border-gray-300">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Middle Notes */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">2</span>
                        <h4 className="font-bold text-black text-sm">Middle Notes (กลิ่นหลัก)</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-3">20 นาที - 4 ชม.</p>
                      <div className="flex flex-wrap gap-1.5">
                        {scent.middleNotes?.map((note: string, i: number) => (
                          <span key={i} className="bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-black border border-gray-300">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Base Notes */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">3</span>
                        <h4 className="font-bold text-black text-sm">Base Notes (กลิ่นฐาน)</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-3">กลิ่นติดทน 6-12 ชม.</p>
                      <div className="flex flex-wrap gap-1.5">
                        {scent.baseNotes?.map((note: string, i: number) => (
                          <span key={i} className="bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-black border border-gray-300">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );

          case 'features_list':
            const items = config.items || [
              { title: 'ของแท้ 100%', description: 'กล่องซีล เช็คโค้ดได้ทุกขวด' },
              { title: 'ผ่อนง่าย', description: 'ไม่เช็คบูโร ไม่ต้องมีบัตรเครดิต' }
            ];

            return (
              <div key={block.id} className={`${getPaddingClass(config.paddingY)} px-4`}>
                <div className="max-w-4xl mx-auto">
                  {config.title && (
                    <h3 className="text-xl sm:text-2xl font-bold text-black text-center mb-8">
                      {config.title}
                    </h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 text-center flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-3">
                          {idx === 0 && <ShieldCheck className="w-6 h-6 text-white" />}
                          {idx === 1 && <CreditCard className="w-6 h-6 text-white" />}
                          {idx === 2 && <CheckCircle2 className="w-6 h-6 text-white" />}
                          {idx >= 3 && <Truck className="w-6 h-6 text-white" />}
                        </div>
                        <h4 className="font-bold text-black text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );

          case 'faq_accordion':
            return <FaqBlock key={block.id} block={block} getPaddingClass={getPaddingClass} />;

          case 'cta_contact':
            return (
              <div key={block.id} className={`${getPaddingClass(config.paddingY)} px-4`}>
                <div className="max-w-3xl mx-auto bg-black rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl">
                  <h3 className="font-black text-2xl sm:text-3xl tracking-tight mb-3">
                    {config.title || 'สนใจผ่อนสินค้านี้ใช่ไหม?'}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto mb-6">
                    {config.subtitle || 'ติดต่อแอดมินทาง LINE OA เพื่อเปิดสัญญาและรับสิทธิ์ผ่อนได้ทันที'}
                  </p>
                  
                  <a
                    href={config.buttonUrl || 'https://line.me'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black px-8 py-4 rounded-full text-base shadow-md hover:scale-105 transition-all"
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                    <span>{config.buttonText || 'แอดไลน์ติดต่อจองสิทธิ์ผ่อน'}</span>
                  </a>
                </div>
              </div>
            );

          case 'image_banner':
            return (
              <div key={block.id} className={`${getPaddingClass(config.paddingY)} px-4`}>
                <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
                  {config.imageUrl ? (
                    <img 
                      src={config.imageUrl} 
                      alt={config.imageAlt || 'Banner'} 
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  ) : (
                    <div className="bg-gray-100 h-64 flex items-center justify-center text-gray-400 text-sm">
                      (Image Banner Placeholder)
                    </div>
                  )}
                </div>
              </div>
            );

          case 'video_embed':
            return (
              <div key={block.id} className={`${getPaddingClass(config.paddingY)} px-4`}>
                <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-video bg-black">
                  {config.videoUrl?.includes('youtube.com') || config.videoUrl?.includes('youtu.be') ? (
                    <iframe
                      src={config.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/70 gap-2">
                      <Play className="w-12 h-12 text-white" />
                      <span className="text-xs">วิดีโอพรีวิวสินค้า</span>
                    </div>
                  )}
                </div>
              </div>
            );

          case 'reviews_grid':
            const reviews = config.reviews || [
              { author: 'คุณกิตติพงษ์', rating: 5, comment: 'ผ่อน Dior Sauvage รายวันสบายมากครับ ของแท้เช็คโค้ดตรง ส่งไวมาก 2 วันถึง' },
              { author: 'คุณพิมพ์พิชชา', rating: 5, comment: 'แอดมินตอบไวมาก ให้คำปรึกษาดี ไม่ต้องจ่ายเงินก้อน ประทับใจมากค่ะ' }
            ];

            return (
              <div key={block.id} className={`${getPaddingClass(config.paddingY)} px-4`}>
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-black text-center mb-6">
                    {config.title || 'รีวิวจากลูกค้าตัวจริงที่ผ่อนกับเรา'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reviews.map((r: any, i: number) => (
                      <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                        <div className="text-xs font-bold text-black mb-2">
                          คะแนนความพึงพอใจ {r.rating || 5}/5
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 italic mb-3 leading-relaxed">
                          &ldquo;{r.comment}&rdquo;
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-bold text-black">{r.author}</span>
                          <span className="text-black flex items-center gap-1 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> ยืนยันผู้ซื้อจริง
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );

          case 'divider':
            return (
              <div key={block.id} className="max-w-2xl mx-auto my-8 flex items-center justify-center gap-4">
                <div className="h-px bg-gray-200 flex-1" />
                <div className="w-2 h-2 rounded-full bg-black" />
                <div className="h-px bg-gray-200 flex-1" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

function FaqBlock({ block, getPaddingClass }: { block: SalePageBlock; getPaddingClass: (p?: string) => string }) {
  const { config = {} } = block;
  const faqs = config.faqs || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={`${getPaddingClass(config.paddingY)} px-4`}>
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-black text-center mb-6">
          {config.title || 'คำถามที่พบบ่อย (FAQ)'}
        </h3>
        <div className="space-y-3">
          {faqs.map((faq: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-black flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-black shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
