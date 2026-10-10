import { Category, InstallmentPlan, Product, WebsiteSettings } from '@/types';

export const initialCategories: Category[] = [
  { id: 'cat-1', name: 'น้ำหอม & ความงาม', slug: 'perfumes-beauty', display_order: 1, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'กระเป๋า & เครื่องหนัง', slug: 'bags-leather', display_order: 2, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'นาฬิกา & เครื่องประดับ', slug: 'watches-jewelry', display_order: 3, is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'รองเท้า & แฟชั่น', slug: 'shoes-fashion', display_order: 4, is_active: true, created_at: new Date().toISOString() },
];

export const initialInstallmentPlans: InstallmentPlan[] = [
  {
    id: 'plan-1',
    name: 'ผ่อนรายวัน 2 เดือน (60 วัน)',
    duration_months: 2,
    frequency: 'daily',
    markup_type: 'percentage',
    markup_value: 10,
    is_active: true,
    is_default: true,
    display_order: 1,
  },
  {
    id: 'plan-2',
    name: 'ผ่อนรายวัน 3 เดือน (90 วัน)',
    duration_months: 3,
    frequency: 'daily',
    markup_type: 'percentage',
    markup_value: 12,
    is_active: true,
    is_default: true,
    display_order: 2,
  },
  {
    id: 'plan-3',
    name: 'ผ่อนรายวัน 6 เดือน (180 วัน) - ยอดนิยม',
    duration_months: 6,
    frequency: 'daily',
    markup_type: 'percentage',
    markup_value: 15, // 5200 * 15% = 780 => 5980 total, / 180 = 33.22 THB/day exactly!
    is_active: true,
    is_default: true,
    display_order: 3,
  },
  {
    id: 'plan-4',
    name: 'ผ่อนรายสัปดาห์ 3 เดือน (12 สัปดาห์)',
    duration_months: 3,
    frequency: 'weekly',
    markup_type: 'percentage',
    markup_value: 12,
    is_active: true,
    is_default: true,
    display_order: 4,
  },
  {
    id: 'plan-5',
    name: 'ผ่อนรายสัปดาห์ 6 เดือน (24 สัปดาห์)',
    duration_months: 6,
    frequency: 'weekly',
    markup_type: 'percentage',
    markup_value: 15,
    is_active: true,
    is_default: true,
    display_order: 5,
  },
  {
    id: 'plan-6',
    name: 'ผ่อนรายเดือน 3 เดือน (3 งวด)',
    duration_months: 3,
    frequency: 'monthly',
    markup_type: 'percentage',
    markup_value: 8,
    is_active: true,
    is_default: true,
    display_order: 6,
  },
  {
    id: 'plan-7',
    name: 'ผ่อนรายเดือน 6 เดือน (6 งวด)',
    duration_months: 6,
    frequency: 'monthly',
    markup_type: 'percentage',
    markup_value: 12,
    is_active: true,
    is_default: true,
    display_order: 7,
  },
];

export const initialWebsiteSettings: WebsiteSettings = {
  store_name: 'YOURPICKPAY',
  tagline: 'ผ่อนสินค้าแบรนด์เนมแท้ 100% สบายกระเป๋า รายวัน รายสัปดาห์ รายเดือน อนุมัติไว ไม่เช็คบูโร',
  logo_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200&auto=format&fit=crop&q=80',
  brand_primary_color: '#000000',
  brand_accent_color: '#111111',
  line_oa_url: 'https://line.me/R/ti/p/@yourpickpay',
  line_oa_id: '@yourpickpay',
  phone_number: '089-123-4567',
  facebook_url: 'https://facebook.com/yourpickpay',
  instagram_url: 'https://instagram.com/yourpickpay',
  tiktok_url: 'https://tiktok.com/@yourpickpay',
  default_seo_title: 'YOURPICKPAY - ผ่อนสินค้าแบรนด์เนมแท้ 100% รายวัน รายเดือน เริ่มต้นวันละ 30 กว่าบาท',
  default_seo_description: 'แคตตาล็อกสินค้าเคาน์เตอร์แบรนด์แท้ 100% พร้อมเครื่องคำนวณผ่อน เลือกผ่อนรายวัน รายสัปดาห์ หรือรายเดือนได้ตามใจคุณ',
  default_og_image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&auto=format&fit=crop&q=80',
  address: 'Siam Paragon ชั้น M, กรุงเทพมหานคร',
  footer_note: 'สินค้าทุกชิ้นนำเข้าจากเคาน์เตอร์แบรนด์แท้ 100% มีอุปกรณ์ครบ เช็คโค้ดได้ทุกชิ้น การันตีของแท้ ยินดีคืนเงินเต็มจำนวนหากพบว่าปลอม'
};

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'CX001',
    name: 'Dior Sauvage Eau de Parfum',
    brand: 'Dior',
    slug: 'dior-sauvage-edp',
    category_id: 'cat-1',
    category_name: 'น้ำหอมผู้ชาย (Men)',
    original_price: 5200,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'น้ำหอมยอดนิยมอันดับ 1 สำหรับสุภาพบุรุษ กลิ่นสดชื่นทรงเสน่ห์ ผสานความดิบเถื่อนและสง่างาม ด้วยกลิ่นเปิดของ Bergamot จาก Reggio di Calabria และปิดท้ายด้วยกลิ่นหอมอบอุ่นเย้ายวนของ Papua New Guinean Vanilla Absolute',
    status: 'published',
    seo_title: 'Dior Sauvage EDP 100ml - ผ่อนน้ำหอมแท้เริ่มต้น 33 บาท/วัน | Yourpickpay',
    seo_description: 'ผ่อน Dior Sauvage EDP แท้ 100% รายวัน รายเดือน ไม่ต้องมีบัตรเครดิต อนุมัติไว ส่งฟรีทั่วประเทศ',
    seo_keywords: 'Dior Sauvage, ผ่อนน้ำหอม, ผ่อนดิออร์, น้ำหอมแท้ผ่อนได้',
    og_image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&auto=format&fit=crop&q=80',
    installment_mode: 'default',
    sale_page_blocks: [
      {
        id: 'block-1',
        type: 'hero_heading',
        config: {
          title: 'Dior Sauvage Eau de Parfum 100ml',
          subtitle: 'สัมผัสกลิ่นหอมไอคอนิกระดับโลก ผ่อนสบายได้ทุกวัน เริ่มต้นเพียง 33 บาท/วัน',
          align: 'center',
          textColor: '#1a1a1a',
          paddingY: 'lg'
        }
      },
      {
        id: 'block-2',
        type: 'scent_notes',
        config: {
          title: 'Scent Pyramid โน้ตความหอมระดับพรีเมียม',
          scentNotes: {
            topNotes: ['Calabrian Bergamot', 'Pepper (พริกไทยสด)'],
            middleNotes: ['Sichuan Pepper', 'Lavender', 'Pink Pepper', 'Vetiver', 'Patchouli', 'Geranium', 'Elemi'],
            baseNotes: ['Ambroxan', 'Cedarwood', 'Papua New Guinean Vanilla']
          },
          paddingY: 'md'
        }
      },
      {
        id: 'block-3',
        type: 'calculator_widget',
        config: {
          title: 'เครื่องคำนวณและเลือกแผนผ่อนชำระ',
          subtitle: 'เลือกแผนผ่อนที่เข้ากับคุณ พร้อมคัดลอกรายละเอียดไปแจ้งแอดมินทาง LINE ได้ทันที',
          showCalculatorDetails: true,
          paddingY: 'md'
        }
      },
      {
        id: 'block-4',
        type: 'features_list',
        config: {
          title: 'ทำไมต้องผ่อนน้ำหอมกับ YOURPICKPAY?',
          items: [
            { title: 'ของแท้ 100%', description: 'กล่องซีล ป้าย สคบ. ไทย/เคาน์เตอร์ห้าง เช็ค Batch Code ได้ทุกขวด', icon: 'shield' },
            { title: 'ไม่ต้องใช้บัตรเครดิต', description: 'อนุมัติง่าย ทุกอาชีพผ่อนได้ นักศึกษา ฟรีแลนซ์ พนักงานประจำ', icon: 'credit-card' },
            { title: 'ยอดผ่อนตรงไปตรงมา', description: 'ไม่มีค่าธรรมเนียมแอบแฝง แสดงยอดต่อวัน ต่อสัปดาห์ชัดเจน', icon: 'check-circle' },
            { title: 'ส่งฟรีด่วน Express', description: 'แพ็คกันกระแทกอย่างหนา จัดส่งรวดเร็วถึงหน้าบ้าน', icon: 'truck' }
          ],
          paddingY: 'lg'
        }
      },
      {
        id: 'block-5',
        type: 'faq_accordion',
        config: {
          title: 'คำถามที่พบบ่อย (FAQ)',
          faqs: [
            { question: 'น้ำหอมเป็นของแท้จริงไหม?', answer: 'แท้ 100% แน่นอนครับ ทุกขวดนำเข้าจากเคาน์เตอร์แบรนด์ มีป้ายไทย/กล่องซีล เช็คโค้ดผ่าน CheckFresh หรือเคาน์เตอร์ได้ หากตรวจพบว่าปลอมยินดีคืนเงินเต็มจำนวน' },
            { question: 'ขั้นตอนการผ่อนทำอย่างไร?', answer: '1. เลือกรุ่นน้ำหอมและแผนผ่อนที่ต้องการ 2. กดปุ่ม "คัดลอกรายละเอียด" 3. กดปุ่ม "ติดต่อแอดมินทาง LINE" แล้วส่งข้อความเพื่อยืนยันสิทธิ์ 4. แอดมินจะส่งเอกสารยืนยันและเริ่มส่งของตามรอบ' },
            { question: 'ผ่อนรายวันต้องโอนเงินอย่างไร?', answer: 'ลูกค้าสามารถโอนยอดตามงวดที่เลือกผ่าน QR Code บัญชีร้านค้าอย่างเป็นทางการได้ทุกวันอย่างสะดวกสบาย' }
          ],
          paddingY: 'md'
        }
      },
      {
        id: 'block-6',
        type: 'cta_contact',
        config: {
          title: 'พร้อมเป็นเจ้าของกลิ่นหอมทรงเสน่ห์แล้วหรือยัง?',
          subtitle: 'แอดไลน์เพื่อเช็คสต็อกและเปิดสัญญาผ่อนได้ทันที ปรึกษาฟรี!',
          buttonText: 'ติดต่อจองสิทธิ์ผ่อนทาง LINE OA',
          buttonUrl: 'https://line.me/R/ti/p/@yourpickpay',
          buttonStyle: 'gold',
          paddingY: 'lg'
        }
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    sku: 'CX002',
    name: 'Bleu de Chanel Parfum',
    brand: 'Chanel',
    slug: 'bleu-de-chanel-parfum',
    category_id: 'cat-1',
    category_name: 'น้ำหอมผู้ชาย (Men)',
    original_price: 6800,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'กลิ่นหอมแห่งอิสรภาพอันทรงพลัง ด้วยสัมผัสของไม้หอมเข้มข้น Cedarwood และ Sandalwood จาก New Caledonia ผสานความสดชื่นของ Lemon Zest และ Mint ติดทนนานเกิน 12 ชั่วโมง',
    status: 'published',
    seo_title: 'Bleu de Chanel Parfum 100ml แท้ ผ่อนรายวัน รายเดือน | Yourpickpay',
    seo_description: 'ผ่อน Bleu de Chanel Parfum ของแท้ 100% ผ่อนเริ่มต้นเบาๆ อนุมัติไว ของแท้เคาน์เตอร์',
    seo_keywords: 'Bleu de Chanel, Chanel Parfum, ผ่อนน้ำหอมชาแนล',
    og_image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&auto=format&fit=crop&q=80',
    installment_mode: 'default',
    sale_page_blocks: [
      {
        id: 'bdc-1',
        type: 'hero_heading',
        config: {
          title: 'Bleu de Chanel Parfum 100ml',
          subtitle: 'ความสุขุม นุ่มลึก และเสน่ห์ที่ไม่เคยจางหาย ผ่อนสบายเริ่มต้นเบาๆ',
          align: 'center',
          paddingY: 'md'
        }
      },
      {
        id: 'bdc-2',
        type: 'calculator_widget',
        config: {
          title: 'คำนวณค่างวดผ่อนชำระ',
          showCalculatorDetails: true,
          paddingY: 'md'
        }
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    sku: 'CX003',
    name: 'YSL Libre Eau de Parfum Intense',
    brand: 'Yves Saint Laurent',
    slug: 'ysl-libre-edp-intense',
    category_id: 'cat-2',
    category_name: 'น้ำหอมผู้หญิง (Women)',
    original_price: 6500,
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'น้ำหอมสำหรับผู้หญิงที่กล้าจะใช้ชีวิตอย่างอิสระ กลิ่นหอมฟลอรัลที่เข้มข้นยิ่งขึ้นด้วย Orchid Accord, French Lavender และ Moroccan Orange Blossom ผสานความหวานเซ็กซี่ของ Vanilla',
    status: 'published',
    seo_title: 'YSL Libre EDP Intense ผ่อนสบายวันละนิด ของแท้ 100% | Yourpickpay',
    seo_description: 'ผ่อนน้ำหอม YSL Libre Intense แท้เคาน์เตอร์ ผ่อนได้ทั้งรายวันและรายเดือน',
    seo_keywords: 'YSL Libre, ผ่อน YSL, น้ำหอมผู้หญิงยอดนิยม',
    og_image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1200&auto=format&fit=crop&q=80',
    installment_mode: 'default',
    sale_page_blocks: [
      {
        id: 'ysl-1',
        type: 'hero_heading',
        config: {
          title: 'YSL Libre Eau de Parfum Intense',
          subtitle: 'อิสรภาพแห่งความหรูหรา กลิ่นหอมหวานเย้ายวนตราตรึงใจ',
          align: 'center',
          paddingY: 'md'
        }
      },
      {
        id: 'ysl-2',
        type: 'calculator_widget',
        config: {
          title: 'ตารางผ่อนชำระค่างวด',
          showCalculatorDetails: true,
          paddingY: 'md'
        }
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    sku: 'CX004',
    name: 'Creed Aventus',
    brand: 'Creed',
    slug: 'creed-aventus',
    category_id: 'cat-4',
    category_name: 'Niche Perfume (นิชแบรนด์)',
    original_price: 13500,
    images: [
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'ราชาแห่งน้ำหอมผู้ชายระดับ Niche กลิ่นสับปะรดรมควันผสาน Birch, Bergamot, Blackcurrant, Apple, Patchouli และ Oakmoss ให้ความรู้สึกของความสำเร็จ อำนาจ และความเป็นผู้นำ',
    status: 'published',
    seo_title: 'Creed Aventus 100ml แท้ 100% ผ่อนรายวัน รายเดือน | Yourpickpay',
    seo_description: 'ผ่อน Creed Aventus ราชาแห่งน้ำหอมนิชแบรนด์ ไม่ต้องจ่ายก้อนใหญ่ ผ่อนสบายรายวัน',
    seo_keywords: 'Creed Aventus, ผ่อน Creed, น้ำหอม Niche ผ่อนได้',
    og_image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&auto=format&fit=crop&q=80',
    installment_mode: 'default',
    sale_page_blocks: [
      {
        id: 'creed-1',
        type: 'hero_heading',
        config: {
          title: 'Creed Aventus Eau de Parfum 100ml',
          subtitle: 'The King of Niche Fragrances น้ำหอมระดับตำนานที่สุภาพบุรุษทุกคนต้องมี',
          align: 'center',
          paddingY: 'lg'
        }
      },
      {
        id: 'creed-2',
        type: 'calculator_widget',
        config: {
          title: 'เครื่องคำนวณผ่อนชำระ Creed Aventus',
          showCalculatorDetails: true,
          paddingY: 'md'
        }
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    sku: 'CX005',
    name: 'Tom Ford Tobacco Vanille',
    brand: 'Tom Ford',
    slug: 'tom-ford-tobacco-vanille',
    category_id: 'cat-3',
    category_name: 'น้ำหอม Unisex',
    original_price: 11200,
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'กลิ่นหอมหรูหราอบอุ่นสไตล์คลับสุภาพบุรุษอังกฤษ ผสานใบยาสูบเกรดพรีเมียม วานิลลาเข้มข้น โกโก้ และผลไม้แห้ง เป็นน้ำหอม Unisex ที่เซ็กซี่และแพงที่สุด',
    status: 'published',
    seo_title: 'Tom Ford Tobacco Vanille แท้ ผ่อนรายวัน | Yourpickpay',
    seo_description: 'ผ่อน Tom Ford Private Blend แท้ 100% เริ่มต้นผ่อนสบายๆ',
    seo_keywords: 'Tom Ford Tobacco Vanille, ผ่อน Tom Ford',
    og_image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200&auto=format&fit=crop&q=80',
    installment_mode: 'default',
    sale_page_blocks: [
      {
        id: 'tf-1',
        type: 'hero_heading',
        config: {
          title: 'Tom Ford Tobacco Vanille 100ml',
          subtitle: 'ที่สุดแห่งความหรูหรา อบอุ่น เซ็กซี่ไร้กาลเวลา',
          align: 'center',
          paddingY: 'md'
        }
      },
      {
        id: 'tf-2',
        type: 'calculator_widget',
        config: {
          title: 'เลือกแผนผ่อน Tom Ford',
          showCalculatorDetails: true,
          paddingY: 'md'
        }
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    sku: 'CX006',
    name: 'Baccarat Rouge 540 Extrait de Parfum',
    brand: 'Maison Francis Kurkdjian',
    slug: 'mfk-baccarat-rouge-540-extrait',
    category_id: 'cat-4',
    category_name: 'Niche Perfume (นิชแบรนด์)',
    original_price: 15900,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'กลิ่นหอมระดับตำนานแห่งยุค MFK 540 Extrait เติมเต็มความสมบูรณ์แบบด้วย Bitter Almond จากโมร็อกโก, Jasmine จากอียิปต์, หญ้าฝรั่น Saffron, Ambergris และ Woody Musk',
    status: 'published',
    seo_title: 'MFK Baccarat Rouge 540 Extrait แท้ 100% ผ่อนสบาย | Yourpickpay',
    seo_description: 'ผ่อน MFK 540 Extrait แท้ นำเข้าเคาน์เตอร์ เช็คโค้ดได้',
    seo_keywords: 'MFK 540, Baccarat Rouge 540, ผ่อน MFK',
    og_image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&auto=format&fit=crop&q=80',
    installment_mode: 'default',
    sale_page_blocks: [
      {
        id: 'mfk-1',
        type: 'hero_heading',
        config: {
          title: 'Maison Francis Kurkdjian - Baccarat Rouge 540 Extrait',
          subtitle: 'กลิ่นหอมที่กระจายตัวระดับทลายห้อง เปล่งประกายดั่งคริสตัลสีแดง',
          align: 'center',
          paddingY: 'md'
        }
      },
      {
        id: 'mfk-2',
        type: 'calculator_widget',
        config: {
          title: 'เครื่องคำนวณยอดผ่อนชำระ',
          showCalculatorDetails: true,
          paddingY: 'md'
        }
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    sku: 'CX007',
    name: 'Jo Malone English Pear & Freesia Cologne',
    brand: 'Jo Malone London',
    slug: 'jo-malone-english-pear-freesia',
    category_id: 'cat-2',
    category_name: 'น้ำหอมผู้หญิง (Women)',
    original_price: 5900,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'กลิ่นหอมสดชื่นละมุนละไมของลูกแพร์สุกฉ่ำ ผสานความหอมบริสุทธิ์ของดอกฟรีเซียสีขาว และโอบล้อมด้วยความอบอุ่นของ Amber และ Patchouli ใช้ง่ายได้ทุกวัน',
    status: 'published',
    seo_title: 'Jo Malone English Pear 100ml ผ่อนเริ่มต้นวันละ 30 กว่าบาท | Yourpickpay',
    seo_description: 'ผ่อน Jo Malone English Pear & Freesia แท้ 100% สบายกระเป๋า',
    seo_keywords: 'Jo Malone, English Pear, ผ่อนโจมาโลน',
    og_image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&auto=format&fit=crop&q=80',
    installment_mode: 'default',
    sale_page_blocks: [
      {
        id: 'jm-1',
        type: 'hero_heading',
        config: {
          title: 'Jo Malone English Pear & Freesia 100ml',
          subtitle: 'กลิ่นหอมยอดนิยมอันดับ 1 ตลอดกาล สดชื่น อ่อนหวาน ผู้ดีอังกฤษ',
          align: 'center',
          paddingY: 'md'
        }
      },
      {
        id: 'jm-2',
        type: 'calculator_widget',
        config: {
          title: 'ตารางผ่อนชำระ',
          showCalculatorDetails: true,
          paddingY: 'md'
        }
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    sku: 'CX008',
    name: 'Acqua Di Gio Parfum',
    brand: 'Giorgio Armani',
    slug: 'acqua-di-gio-parfum',
    category_id: 'cat-1',
    category_name: 'น้ำหอมผู้ชาย (Men)',
    original_price: 5400,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'ความสดชื่นอันลุ่มลึกของท้องทะเลเมดิเตอร์เรเนียน กลิ่นโน้ต Marine ผสาน Bergamot, Rosemary, Incense กลิ่นหอมเท่ สปอร์ต มีระดับ ติดทนนาน',
    status: 'published',
    seo_title: 'Acqua Di Gio Parfum แท้ ผ่อนรายวัน | Yourpickpay',
    seo_description: 'ผ่อน Armani Acqua Di Gio Parfum ของแท้ 100% ผ่อนสบาย',
    seo_keywords: 'Acqua Di Gio, Armani Perfume, ผ่อนน้ำหอมผู้ชาย',
    og_image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&auto=format&fit=crop&q=80',
    installment_mode: 'default',
    sale_page_blocks: [
      {
        id: 'adg-1',
        type: 'hero_heading',
        config: {
          title: 'Giorgio Armani Acqua Di Gio Parfum 100ml',
          subtitle: 'ความสดชื่นแห่งท้องทะเล ผสานความสุขุมนุ่มลึกของไม้หอม',
          align: 'center',
          paddingY: 'md'
        }
      },
      {
        id: 'adg-2',
        type: 'calculator_widget',
        config: {
          title: 'คำนวณค่างวดผ่อน',
          showCalculatorDetails: true,
          paddingY: 'md'
        }
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
