-- ==============================================================================
-- YOURPICKPAY PERFUME INSTALLMENT CATALOG & CMS
-- SUPABASE POSTGRESQL SCHEMA WITH ROW-LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. INSTALLMENT PLANS TABLE
CREATE TABLE IF NOT EXISTS public.installment_plans (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    duration_months INTEGER NOT NULL CHECK (duration_months > 0),
    frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    markup_type VARCHAR(50) NOT NULL CHECK (markup_type IN ('percentage', 'fixed')),
    markup_value NUMERIC(10, 2) NOT NULL CHECK (markup_value >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name VARCHAR(255),
    original_price NUMERIC(12, 2) NOT NULL CHECK (original_price >= 0),
    images JSONB DEFAULT '[]'::jsonb NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    
    -- SEO Metadata
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    og_image TEXT,
    
    -- Installment Configuration
    installment_mode VARCHAR(50) DEFAULT 'default' CHECK (installment_mode IN ('default', 'custom', 'override')),
    custom_plan_ids JSONB DEFAULT '[]'::jsonb,
    override_plans JSONB DEFAULT '[]'::jsonb,
    
    -- Block-Based Sale Page Builder JSONB Schema
    sale_page_blocks JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.website_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default_settings',
    store_name VARCHAR(255) NOT NULL,
    tagline TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    brand_primary_color VARCHAR(50) DEFAULT '#b87c53',
    brand_accent_color VARCHAR(50) DEFAULT '#d97706',
    line_oa_url TEXT NOT NULL,
    line_oa_id VARCHAR(100),
    phone_number VARCHAR(100),
    facebook_url TEXT,
    instagram_url TEXT,
    tiktok_url TEXT,
    default_seo_title TEXT,
    default_seo_description TEXT,
    default_og_image TEXT,
    address TEXT,
    footer_note TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_sale_page_blocks ON public.products USING gin (sale_page_blocks);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_installment_plans_active ON public.installment_plans(is_active);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Allow anonymous customers to read active data)
CREATE POLICY "Allow public read published products" 
    ON public.products FOR SELECT 
    USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Allow public read active categories" 
    ON public.categories FOR SELECT 
    USING (is_active = TRUE OR auth.role() = 'authenticated');

CREATE POLICY "Allow public read active installment plans" 
    ON public.installment_plans FOR SELECT 
    USING (is_active = TRUE OR auth.role() = 'authenticated');

CREATE POLICY "Allow public read website settings" 
    ON public.website_settings FOR SELECT 
    USING (true);

-- 2. Authenticated Admin Write Policies (CRUD restricted to authenticated admin users)
CREATE POLICY "Allow authenticated insert products" 
    ON public.products FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' OR auth.jwt() IS NOT NULL);

CREATE POLICY "Allow authenticated update products" 
    ON public.products FOR UPDATE 
    USING (auth.role() = 'authenticated' OR auth.jwt() IS NOT NULL);

CREATE POLICY "Allow authenticated delete products" 
    ON public.products FOR DELETE 
    USING (auth.role() = 'authenticated' OR auth.jwt() IS NOT NULL);

CREATE POLICY "Allow authenticated CRUD categories" 
    ON public.categories FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.jwt() IS NOT NULL);

CREATE POLICY "Allow authenticated CRUD installment plans" 
    ON public.installment_plans FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.jwt() IS NOT NULL);

CREATE POLICY "Allow authenticated CRUD settings" 
    ON public.website_settings FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.jwt() IS NOT NULL);
