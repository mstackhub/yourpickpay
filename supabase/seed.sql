-- ==============================================================================
-- YOURPICKPAY SEED DATA
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, display_order, is_active) VALUES
('cat-1', 'น้ำหอมผู้ชาย (Men)', 'men', 1, true),
('cat-2', 'น้ำหอมผู้หญิง (Women)', 'women', 2, true),
('cat-3', 'น้ำหอม Unisex', 'unisex', 3, true),
('cat-4', 'Niche Perfume (นิชแบรนด์)', 'niche', 4, true)
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
slug = EXCLUDED.slug;

-- 2. Insert Default Installment Plans
INSERT INTO public.installment_plans (id, name, duration_months, frequency, markup_type, markup_value, is_active, is_default, display_order) VALUES
('plan-1', 'ผ่อนรายวัน 2 เดือน (60 วัน)', 2, 'daily', 'percentage', 10.00, true, true, 1),
('plan-2', 'ผ่อนรายวัน 3 เดือน (90 วัน)', 3, 'daily', 'percentage', 12.00, true, true, 2),
('plan-3', 'ผ่อนรายวัน 6 เดือน (180 วัน) - ยอดนิยม', 6, 'daily', 'percentage', 15.00, true, true, 3),
('plan-4', 'ผ่อนรายสัปดาห์ 3 เดือน (12 สัปดาห์)', 3, 'weekly', 'percentage', 12.00, true, true, 4),
('plan-5', 'ผ่อนรายสัปดาห์ 6 เดือน (24 สัปดาห์)', 6, 'weekly', 'percentage', 15.00, true, true, 5),
('plan-6', 'ผ่อนรายเดือน 3 เดือน (3 งวด)', 3, 'monthly', 'percentage', 8.00, true, true, 6),
('plan-7', 'ผ่อนรายเดือน 6 เดือน (6 งวด)', 6, 'monthly', 'percentage', 12.00, true, true, 7)
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
markup_value = EXCLUDED.markup_value;

-- 3. Insert Website Settings
INSERT INTO public.website_settings (
    id, store_name, tagline, logo_url, brand_primary_color, brand_accent_color,
    line_oa_url, line_oa_id, phone_number, facebook_url, instagram_url,
    default_seo_title, default_seo_description, default_og_image, address, footer_note
) VALUES (
    'default_settings',
    'YOURPICKPAY',
    'ผ่อนน้ำหอมแท้ 100% สบายกระเป๋า รายวัน รายสัปดาห์ รายเดือน อนุมัติไว ไม่เช็คบูโร',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200',
    '#b87c53',
    '#d97706',
    'https://line.me/R/ti/p/@yourpickpay',
    '@yourpickpay',
    '089-123-4567',
    'https://facebook.com/yourpickpay',
    'https://instagram.com/yourpickpay',
    'YOURPICKPAY - ผ่อนน้ำหอมแบรนด์เนมแท้ 100% รายวัน รายเดือน เริ่มต้นวันละ 30 กว่าบาท',
    'แคตตาล็อกน้ำหอมเคาน์เตอร์แบรนด์แท้ Dior, Chanel, Creed, YSL พร้อมเครื่องคำนวณผ่อน เลือกผ่อนรายวัน รายสัปดาห์ หรือรายเดือนได้ตามใจคุณ',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200',
    'Siam Paragon ชั้น M, กรุงเทพมหานคร',
    'น้ำหอมทุกขวดนำเข้าจากเคาน์เตอร์แบรนด์แท้ 100% มีกล่อง ป้าย สคบ. ครบ เช็คโค้ดได้ทุกขวด ยินดีคืนเงินเต็มจำนวนหากพบว่าปลอม'
) ON CONFLICT (id) DO UPDATE SET
store_name = EXCLUDED.store_name;

-- 4. Insert Primary Product (Dior Sauvage)
INSERT INTO public.products (
    id, sku, name, brand, slug, category_id, category_name, original_price,
    images, description, status, seo_title, seo_description, seo_keywords, og_image,
    installment_mode, sale_page_blocks
) VALUES (
    'prod-1',
    'CX001',
    'Dior Sauvage Eau de Parfum',
    'Dior',
    'dior-sauvage-edp',
    'cat-1',
    'น้ำหอมผู้ชาย (Men)',
    5200.00,
    '["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800", "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800"]'::jsonb,
    'น้ำหอมยอดนิยมอันดับ 1 สำหรับสุภาพบุรุษ กลิ่นสดชื่นทรงเสน่ห์ ผสานความดิบเถื่อนและสง่างาม',
    'published',
    'Dior Sauvage EDP 100ml - ผ่อนน้ำหอมแท้เริ่มต้น 33 บาท/วัน | Yourpickpay',
    'ผ่อน Dior Sauvage EDP แท้ 100% รายวัน รายเดือน ไม่ต้องมีบัตรเครดิต อนุมัติไว ส่งฟรีทั่วประเทศ',
    'Dior Sauvage, ผ่อนน้ำหอม, ผ่อนดิออร์',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200',
    'default',
    '[
        {"id": "b-1", "type": "hero_heading", "config": {"title": "Dior Sauvage Eau de Parfum 100ml", "subtitle": "สัมผัสกลิ่นหอมไอคอนิกระดับโลก ผ่อนสบายได้ทุกวัน เริ่มต้นเพียง 33 บาท/วัน", "align": "center", "paddingY": "lg"}},
        {"id": "b-2", "type": "calculator_widget", "config": {"title": "เครื่องคำนวณและเลือกแผนผ่อนชำระ", "showCalculatorDetails": true, "paddingY": "md"}},
        {"id": "b-3", "type": "scent_notes", "config": {"title": "พีระมิดโน้ตความหอม (Scent Notes)", "scentNotes": {"topNotes": ["Calabrian Bergamot", "Pepper"], "middleNotes": ["Sichuan Pepper", "Lavender", "Pink Pepper"], "baseNotes": ["Ambroxan", "Cedarwood", "Vanilla"]}, "paddingY": "md"}},
        {"id": "b-4", "type": "cta_contact", "config": {"title": "พร้อมเป็นเจ้าของกลิ่นหอมทรงเสน่ห์แล้วหรือยัง?", "buttonText": "ติดต่อจองสิทธิ์ผ่อนทาง LINE OA", "buttonUrl": "https://line.me/R/ti/p/@yourpickpay", "paddingY": "lg"}}
    ]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
original_price = EXCLUDED.original_price;
