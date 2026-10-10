import { createClient, Client } from '@libsql/client';
import { Product, Category, InstallmentPlan, WebsiteSettings } from '@/types';
import { initialCategories, initialInstallmentPlans, initialProducts, initialWebsiteSettings } from './mockData';

const url = process.env.TURSO_DATABASE_URL || 'libsql://yourpickpay-mstackhub.aws-ap-northeast-1.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE2MjQxNDksImlkIjoiMDFhMTI1MWUtYTgwMS03MmYwLWIwMWUtYzczNDIzMGQ5ZTlkIiwia2lkIjoiU1ZYRTc1Vy1QcHV4aWQ2RXJ6WlRRTzVNLW5OeVBzX0RjSm5qa0ZycXZ0YyIsInJpZCI6ImE4YWU1ODlhLWRkYjUtNGIxNS1iOTRlLTkzNzc2ZTMyMDY3OSJ9.x7ojB9c724eBh65_4zKMvEof6ZAn8ECLyuOsDwKKknCTHKYZBVcn1IvaufG01Y-HIHrR0IaBXuzLc7FDuKZQCw';

export const turso: Client = createClient({
  url,
  authToken,
});

export const isTursoConfigured = Boolean(url && authToken);

/**
 * Initialize Tables in Turso Database
 */
export async function initTursoSchema() {
  if (!isTursoConfigured) return;

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
      down_payment_mode TEXT DEFAULT 'default',
      down_payment_type TEXT DEFAULT 'percentage',
      down_payment_value REAL DEFAULT 0,
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
      footer_note TEXT,
      enable_down_payment INTEGER DEFAULT 0,
      default_down_payment_type TEXT DEFAULT 'percentage',
      default_down_payment_value REAL DEFAULT 0
    )
  `);
}

/**
 * Seed Turso with initial data if tables are empty
 */
export async function seedTursoData() {
  if (!isTursoConfigured) return;

  await initTursoSchema();

  // Check categories
  const catCount = await turso.execute('SELECT COUNT(*) as count FROM categories');
  if (Number(catCount.rows[0]?.count || 0) === 0) {
    for (const cat of initialCategories) {
      await turso.execute({
        sql: 'INSERT INTO categories (id, name, slug, display_order, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        args: [cat.id, cat.name, cat.slug, cat.display_order, cat.is_active ? 1 : 0, cat.created_at || new Date().toISOString()]
      });
    }
  }

  // Check installment plans
  const planCount = await turso.execute('SELECT COUNT(*) as count FROM installment_plans');
  if (Number(planCount.rows[0]?.count || 0) === 0) {
    for (const p of initialInstallmentPlans) {
      await turso.execute({
        sql: 'INSERT INTO installment_plans (id, name, duration_months, frequency, markup_type, markup_value, fixed_amount_per_period, is_active, is_default, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [
          p.id,
          p.name,
          p.duration_months,
          p.frequency,
          p.markup_type || 'percentage',
          p.markup_value || 0,
          p.fixed_amount_per_period || null,
          p.is_active ? 1 : 0,
          p.is_default ? 1 : 0,
          p.display_order || 1,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });
    }
  }

  // Check products
  const prodCount = await turso.execute('SELECT COUNT(*) as count FROM products');
  if (Number(prodCount.rows[0]?.count || 0) === 0) {
    for (const prod of initialProducts) {
      await turso.execute({
        sql: `INSERT INTO products (
          id, sku, name, brand, slug, category_id, original_price, images, description, status,
          seo_title, seo_description, seo_keywords, og_image, installment_mode, custom_plan_ids,
          override_plans, sale_page_blocks, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          prod.id,
          prod.sku,
          prod.name,
          prod.brand || '',
          prod.slug,
          prod.category_id,
          prod.original_price,
          JSON.stringify(prod.images || []),
          prod.description || '',
          prod.status || 'published',
          prod.seo_title || '',
          prod.seo_description || '',
          prod.seo_keywords || '',
          prod.og_image || '',
          prod.installment_mode || 'global',
          JSON.stringify(prod.custom_plan_ids || []),
          JSON.stringify(prod.override_plans || []),
          JSON.stringify(prod.sale_page_blocks || []),
          prod.created_at || new Date().toISOString(),
          prod.updated_at || new Date().toISOString()
        ]
      });
    }
  }

  // Check settings
  const settingsCount = await turso.execute('SELECT COUNT(*) as count FROM website_settings');
  if (Number(settingsCount.rows[0]?.count || 0) === 0) {
    await turso.execute({
      sql: `INSERT INTO website_settings (
        id, store_name, tagline, logo_url, brand_primary_color, brand_accent_color,
        line_oa_url, line_oa_id, phone_number, facebook_url, instagram_url, tiktok_url,
        default_seo_title, default_seo_description, default_og_image, address, footer_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'default',
        initialWebsiteSettings.store_name,
        initialWebsiteSettings.tagline,
        initialWebsiteSettings.logo_url || '',
        initialWebsiteSettings.brand_primary_color || '#000000',
        initialWebsiteSettings.brand_accent_color || '#111111',
        initialWebsiteSettings.line_oa_url || '',
        initialWebsiteSettings.line_oa_id || '',
        initialWebsiteSettings.phone_number || '',
        initialWebsiteSettings.facebook_url || '',
        initialWebsiteSettings.instagram_url || '',
        initialWebsiteSettings.tiktok_url || '',
        initialWebsiteSettings.default_seo_title || '',
        initialWebsiteSettings.default_seo_description || '',
        initialWebsiteSettings.default_og_image || '',
        initialWebsiteSettings.address || '',
        initialWebsiteSettings.footer_note || ''
      ]
    });
  }
}
