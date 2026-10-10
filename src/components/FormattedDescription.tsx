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

  let paragraphs = cleanText.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <span className="font-extrabold text-xs sm:text-sm text-zinc-950 uppercase tracking-wider flex items-center gap-2">
          <span>รายละเอียดสินค้า (Product Details)</span>
        </span>
      </div>

      <div className="space-y-3.5 text-xs sm:text-sm text-zinc-800 leading-relaxed font-normal">
        {paragraphs.map((p, pIdx) => {
          if (p.includes(' - ') || p.includes(' • ') || p.startsWith('-') || p.startsWith('•')) {
            const parts = p.split(/\s*[\-\•]\s+/).filter(Boolean);
            const titlePart = p.startsWith('-') || p.startsWith('•') ? null : parts[0];
            const bulletParts = titlePart ? parts.slice(1) : parts;

            return (
              <div key={pIdx} className="space-y-2">
                {titlePart && (
                  <p className="font-bold text-zinc-950">
                    {titlePart.replace(/(ขนาด|ประเภท|ความจุ).*/i, '').trim()}
                  </p>
                )}
                {bulletParts.length > 0 && (
                  <ul className="space-y-1.5 pl-1">
                    {bulletParts.map((item, bIdx) => {
                      const cleanItem = item.replace(/(ขนาด|ประเภท|ความจุ)\s*[:：].*/i, '').trim();
                      if (!cleanItem) return null;

                      return (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 shrink-0 mt-2" />
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
        <div className="pt-3 border-t border-zinc-100">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            ข้อมูลจำเพาะ (Specifications)
          </span>
          <div className="flex flex-wrap gap-2">
            {specs.map((spec, sIdx) => (
              <div
                key={sIdx}
                className="inline-flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200 text-xs"
              >
                <span className="font-bold text-zinc-900">{spec.label}:</span>
                <span className="text-zinc-600 font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
