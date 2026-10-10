export type InstallmentFrequency = 'daily' | 'weekly' | 'monthly';
export type MarkupType = 'percentage' | 'fixed';
export type ProductStatus = 'published' | 'draft' | 'archived';
export type InstallmentMode = 'default' | 'custom' | 'override';

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface InstallmentPlan {
  id: string;
  name: string;
  duration_months: number;
  frequency: InstallmentFrequency;
  markup_type: MarkupType;
  markup_value: number; // e.g. 15 for 15%, or 500 for 500 THB
  fixed_amount_per_period?: number | null;
  is_active: boolean;
  is_default: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export type BlockType = 
  | 'hero_heading'
  | 'text_content'
  | 'product_showcase'
  | 'calculator_widget'
  | 'image_banner'
  | 'video_embed'
  | 'scent_notes'
  | 'features_list'
  | 'faq_accordion'
  | 'cta_contact'
  | 'reviews_grid'
  | 'divider';

export interface SalePageBlock {
  id: string;
  type: BlockType;
  title?: string;
  is_hidden?: boolean;
  config: {
    title?: string;
    subtitle?: string;
    content?: string;
    align?: 'left' | 'center' | 'right';
    textColor?: string;
    bgColor?: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    imageUrl?: string;
    imageAlt?: string;
    aspectRatio?: 'auto' | 'square' | 'video' | 'portrait';
    videoUrl?: string; // YouTube or MP4
    buttonText?: string;
    buttonUrl?: string;
    buttonStyle?: 'primary' | 'secondary' | 'gold' | 'outline';
    items?: Array<{
      title: string;
      description: string;
      icon?: string;
      tag?: string;
    }>;
    scentNotes?: {
      topNotes: string[];
      middleNotes: string[];
      baseNotes: string[];
    };
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
    reviews?: Array<{
      author: string;
      rating: number;
      comment: string;
      date?: string;
      verified?: boolean;
    }>;
    showCalculatorDetails?: boolean;
    [key: string]: any;
  };
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  slug: string;
  category_id: string;
  category_name?: string;
  original_price: number;
  images: string[];
  description: string;
  status: ProductStatus;
  
  // SEO
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image?: string;
  
  // Installment configuration
  installment_mode: InstallmentMode;
  custom_plan_ids?: string[]; // IDs of global plans allowed for this product
  override_plans?: InstallmentPlan[]; // Specific override plans
  
  // Sale Page Builder
  sale_page_blocks: SalePageBlock[];
  
  created_at: string;
  updated_at: string;
}

export interface InstallmentCalculationResult {
  plan_id: string;
  plan_name: string;
  duration_months: number;
  frequency: InstallmentFrequency;
  total_periods: number;
  original_price: number;
  markup_amount: number;
  total_installment_price: number;
  installment_per_period: number;
  last_installment_amount: number;
  period_label: string; // e.g. "THB/day", "THB/week", "THB/month"
  frequency_th: string; // e.g. "รายวัน", "รายสัปดาห์", "รายเดือน"
  copy_text: string;
  schedule: Array<{
    period: number;
    amount: number;
    remaining: number;
  }>;
}

export interface WebsiteSettings {
  store_name: string;
  tagline: string;
  logo_url: string;
  favicon_url?: string;
  brand_primary_color: string;
  brand_accent_color: string;
  line_oa_url: string;
  line_oa_id: string;
  phone_number: string;
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  default_seo_title: string;
  default_seo_description: string;
  default_og_image?: string;
  address?: string;
  footer_note?: string;
}
