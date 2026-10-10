import { createClient } from '@libsql/client';

const url = "libsql://yourpickpay-mstackhub.aws-ap-northeast-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE2MjQxNDksImlkIjoiMDFhMTI1MWUtYTgwMS03MmYwLWIwMWUtYzczNDIzMGQ5ZTlkIiwia2lkIjoiU1ZYRTc1Vy1QcHV4aWQ2RXJ6WlRRTzVNLW5OeVBzX0RjSm5qa0ZycXZ0YyIsInJpZCI6ImE4YWU1ODlhLWRkYjUtNGIxNS1iOTRlLTkzNzc2ZTMyMDY3OSJ9.x7ojB9c724eBh65_4zKMvEof6ZAn8ECLyuOsDwKKknCTHKYZBVcn1IvaufG01Y-HIHrR0IaBXuzLc7FDuKZQCw";

const turso = createClient({ url, authToken });

async function main() {
  console.log('Connecting to Turso...');

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      display_order INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at TEXT
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS installment_plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      duration_months INTEGER NOT NULL,
      frequency TEXT NOT NULL,
      markup_type TEXT DEFAULT 'percentage',
      markup_value REAL NOT NULL,
      fixed_amount_per_period REAL,
      is_active INTEGER DEFAULT 1,
      is_default INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 1,
      created_at TEXT,
      updated_at TEXT
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT,
      name TEXT NOT NULL,
      brand TEXT,
      slug TEXT UNIQUE,
      category_id TEXT,
      original_price REAL NOT NULL,
      images TEXT,
      description TEXT,
      status TEXT DEFAULT 'published',
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      og_image TEXT,
      installment_mode TEXT DEFAULT 'global',
      custom_plan_ids TEXT,
      override_plans TEXT,
      sale_page_blocks TEXT,
      created_at TEXT,
      updated_at TEXT
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS website_settings (
      id TEXT PRIMARY KEY,
      store_name TEXT,
      tagline TEXT,
      logo_url TEXT,
      brand_primary_color TEXT,
      brand_accent_color TEXT,
      line_oa_url TEXT,
      line_oa_id TEXT,
      phone_number TEXT,
      facebook_url TEXT,
      instagram_url TEXT,
      tiktok_url TEXT,
      default_seo_title TEXT,
      default_seo_description TEXT,
      default_og_image TEXT,
      address TEXT,
      footer_note TEXT
    )
  `);

  console.log('Tables created in Turso successfully!');

  // Insert settings
  await turso.execute({
    sql: `INSERT INTO website_settings (
      id, store_name, tagline, logo_url, brand_primary_color, brand_accent_color,
      line_oa_url, line_oa_id, phone_number, facebook_url, instagram_url, tiktok_url,
      default_seo_title, default_seo_description, default_og_image, address, footer_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      store_name=excluded.store_name,
      tagline=excluded.tagline,
      footer_note=excluded.footer_note`,
    args: [
      'default',
      'YOURPICKPAY',
      'ผ่อนสินค้าแบรนด์เนมแท้ 100% สบายกระเป๋า รายวัน รายสัปดาห์ รายเดือน อนุมัติไว ไม่เช็คบูโร',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200&auto=format&fit=crop&q=80',
      '#000000',
      '#111111',
      'https://line.me/R/ti/p/@yourpickpay',
      '@yourpickpay',
      '089-123-4567',
      'https://facebook.com/yourpickpay',
      'https://instagram.com/yourpickpay',
      'https://tiktok.com/@yourpickpay',
      'YOURPICKPAY - ผ่อนสินค้าแบรนด์เนมแท้ 100% รายวัน รายเดือน เริ่มต้นวันละ 30 กว่าบาท',
      'แคตตาล็อกสินค้าเคาน์เตอร์แบรนด์แท้ 100% พร้อมเครื่องคำนวณผ่อน เลือกผ่อนรายวัน รายสัปดาห์ หรือรายเดือนได้ตามใจคุณ',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&auto=format&fit=crop&q=80',
      'Siam Paragon ชั้น M, กรุงเทพมหานคร',
      'สินค้าทุกชิ้นนำเข้าจากเคาน์เตอร์แบรนด์แท้ 100% มีอุปกรณ์ครบ เช็คโค้ดได้ทุกชิ้น การันตีของแท้ ยินดีคืนเงินเต็มจำนวนหากพบว่าปลอม'
    ]
  });

  console.log('Website settings inserted into Turso!');

  // Seed Categories
  const categories = [
    { id: 'cat-1', name: 'น้ำหอม & ความงาม', slug: 'perfumes-beauty', display_order: 1, is_active: 1 },
    { id: 'cat-2', name: 'กระเป๋า & เครื่องหนัง', slug: 'bags-leather', display_order: 2, is_active: 1 },
    { id: 'cat-3', name: 'นาฬิกา & เครื่องประดับ', slug: 'watches-jewelry', display_order: 3, is_active: 1 },
    { id: 'cat-4', name: 'รองเท้า & แฟชั่น', slug: 'shoes-fashion', display_order: 4, is_active: 1 },
  ];

  for (const cat of categories) {
    await turso.execute({
      sql: `INSERT INTO categories (id, name, slug, display_order, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name=excluded.name, slug=excluded.slug`,
      args: [cat.id, cat.name, cat.slug, cat.display_order, cat.is_active, new Date().toISOString()]
    });
  }
  console.log('Categories seeded into Turso!');

  // Seed Installment Plans
  const plans = [
    { id: 'plan-1', name: 'ผ่อนรายวัน 2 เดือน (60 วัน)', duration_months: 2, frequency: 'daily', markup_type: 'percentage', markup_value: 10, display_order: 1 },
    { id: 'plan-2', name: 'ผ่อนรายวัน 3 เดือน (90 วัน)', duration_months: 3, frequency: 'daily', markup_type: 'percentage', markup_value: 12, display_order: 2 },
    { id: 'plan-3', name: 'ผ่อนรายวัน 6 เดือน (180 วัน) - ยอดนิยม', duration_months: 6, frequency: 'daily', markup_type: 'percentage', markup_value: 15, display_order: 3 },
    { id: 'plan-4', name: 'ผ่อนรายสัปดาห์ 3 เดือน (12 สัปดาห์)', duration_months: 3, frequency: 'weekly', markup_type: 'percentage', markup_value: 12, display_order: 4 },
    { id: 'plan-5', name: 'ผ่อนรายสัปดาห์ 6 เดือน (24 สัปดาห์)', duration_months: 6, frequency: 'weekly', markup_type: 'percentage', markup_value: 15, display_order: 5 },
    { id: 'plan-6', name: 'ผ่อนรายเดือน 3 เดือน (3 งวด)', duration_months: 3, frequency: 'monthly', markup_type: 'percentage', markup_value: 8, display_order: 6 },
    { id: 'plan-7', name: 'ผ่อนรายเดือน 6 เดือน (6 งวด)', duration_months: 6, frequency: 'monthly', markup_type: 'percentage', markup_value: 12, display_order: 7 },
  ];

  for (const p of plans) {
    await turso.execute({
      sql: `INSERT INTO installment_plans (id, name, duration_months, frequency, markup_type, markup_value, is_active, is_default, display_order, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name=excluded.name, markup_value=excluded.markup_value`,
      args: [p.id, p.name, p.duration_months, p.frequency, p.markup_type, p.markup_value, p.display_order, new Date().toISOString(), new Date().toISOString()]
    });
  }
  console.log('Installment plans seeded into Turso!');

  // Seed Sample Products
  const products = [
    {
      id: 'prod-1',
      sku: 'CX001',
      name: 'Dior Sauvage Eau de Parfum',
      brand: 'Dior',
      slug: 'dior-sauvage-edp',
      category_id: 'cat-1',
      original_price: 5200,
      images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800'],
      description: 'สินค้ายอดนิยมอันดับ 1 สำหรับสุภาพบุรุษ กลิ่นสดชื่นทรงเสน่ห์ ผสานความดิบเถื่อนและสง่างาม',
    },
    {
      id: 'prod-2',
      sku: 'CX002',
      name: 'Bleu de Chanel Parfum',
      brand: 'Chanel',
      slug: 'bleu-de-chanel-parfum',
      category_id: 'cat-1',
      original_price: 5900,
      images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800'],
      description: 'นิยามแห่งความสง่างามเหนือกาลเวลาสำหรับสุภาพบุรุษ',
    },
    {
      id: 'prod-3',
      sku: 'CX003',
      name: 'YSL Libre Eau de Parfum Intense',
      brand: 'Yves Saint Laurent',
      slug: 'ysl-libre-intense',
      category_id: 'cat-1',
      original_price: 6400,
      images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800'],
      description: 'สำหรับผู้ที่กล้าจะใช้ชีวิตอย่างอิสระ กลิ่นหอมฟลอรัลที่เข้มข้นยิ่งขึ้น',
    },
    {
      id: 'prod-4',
      sku: 'CX004',
      name: 'Creed Aventus',
      brand: 'Creed',
      slug: 'creed-aventus',
      category_id: 'cat-1',
      original_price: 13500,
      images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'],
      description: 'ราชาแห่งนิชแบรนด์ กลิ่นสับปะรดรมควันผสาน Birch และ Bergamot ให้ความรู้สึกของความสำเร็จ',
    }
  ];

  for (const prod of products) {
    await turso.execute({
      sql: `INSERT INTO products (
        id, sku, name, brand, slug, category_id, original_price, images, description, status,
        installment_mode, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 'global', ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        original_price=excluded.original_price,
        images=excluded.images`,
      args: [
        prod.id,
        prod.sku,
        prod.name,
        prod.brand,
        prod.slug,
        prod.category_id,
        prod.original_price,
        JSON.stringify(prod.images),
        prod.description,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    });
  }
  console.log('Sample products seeded into Turso!');
}

main().catch(console.error);
