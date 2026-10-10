'use client';

import React from 'react';
import { Sparkles, CheckCircle, Tag } from 'lucide-react';

interface Props {
  text: string;
}

export default function FormattedDescription({ text }: Props) {
  if (!text) return null;

  // 1. Extract specifications if any (e.g., ขนาด: 100 ML, ประเภท: EDP, แบรนด์: ...)
  const specs: Array<{ label: string; value: string }> = [];
  let cleanText = text;

  // Regex to match "ขนาด: 100 ML" or "ประเภท: Eau de Parfum (EDP)"
  const specRegex = /(ขนาด|ประเภท|ความจุ|ปริมาณ|กลิ่น|เพศ|ผลิตที่|Size|Type|Volume|Gender)\s*[:：]\s*([^\n\-\—\,]+)/gi;
  let match;
  while ((match = specRegex.exec(text)) !== null) {
    specs.push({
      label: match[1].trim(),
      value: match[2].trim(),
    });
  }

  // Remove matched specs from body to avoid repeating if desired, or keep text clean
  // Let's split into paragraphs or intelligently split inline bullets
  let paragraphs = cleanText.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="bg-zinc-50 p-6 border border-zinc-200 space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <span className="font-black text-sm text-black uppercase tracking-wider flex items-center gap-2">
          <span>เกี่ยวกับสินค้านี้ (Product Details)</span>
        </span>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-zinc-800 leading-relaxed font-normal">
        {paragraphs.map((p, pIdx) => {
          // Check if paragraph contains inline dash bullets like "จุดเด่น - ข้อ 1 - ข้อ 2"
          if (p.includes(' - ') || p.includes(' • ') || p.startsWith('-') || p.startsWith('•')) {
            const parts = p.split(/\s*[\-\•]\s+/).filter(Boolean);
            const titlePart = p.startsWith('-') || p.startsWith('•') ? null : parts[0];
            const bulletParts = titlePart ? parts.slice(1) : parts;

            return (
              <div key={pIdx} className="space-y-2.5">
                {titlePart && (
                  <p className="font-bold text-black">
                    {titlePart.replace(/(ขนาด|ประเภท|ความจุ).*/i, '').trim()}
                  </p>
                )}
                {bulletParts.length > 0 && (
                  <ul className="space-y-2 pl-1">
                    {bulletParts.map((item, bIdx) => {
                      // Filter out trailing specs if they were caught in the bullet
                      const cleanItem = item.replace(/(ขนาด|ประเภท|ความจุ)\s*[:：].*/i, '').trim();
                      if (!cleanItem) return null;

                      return (
                        <li key={bIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 bg-black shrink-0 mt-2" />
                          <span className="text-zinc-700">{cleanItem}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          }

          return (
            <p key={pIdx} className="leading-relaxed text-zinc-700">
              {p}
            </p>
          );
        })}
      </div>

      {/* Specifications Badges */}
      {specs.length > 0 && (
        <div className="pt-4 border-t border-zinc-200">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            ข้อมูลจำเพาะ (Specifications)
          </span>
          <div className="flex flex-wrap gap-2">
            {specs.map((spec, sIdx) => (
              <div
                key={sIdx}
                className="inline-flex items-center gap-2 bg-white px-3 py-1.5 border border-zinc-300 text-xs shadow-xs"
              >
                <span className="font-bold text-black">{spec.label}:</span>
                <span className="text-zinc-700 font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
