import { NextResponse } from 'next/server';
import { turso, isTursoConfigured, seedTursoData } from '@/lib/turso';
import { WebsiteSettings } from '@/types';
import { initialWebsiteSettings } from '@/lib/mockData';

export async function GET() {
  if (!isTursoConfigured) {
    return NextResponse.json(initialWebsiteSettings);
  }

  try {
    await seedTursoData();
    const result = await turso.execute('SELECT * FROM website_settings WHERE id = "default" LIMIT 1');
    if (result.rows.length === 0) {
      return NextResponse.json(initialWebsiteSettings);
    }

    const row: any = result.rows[0];
    const settings: WebsiteSettings = {
      store_name: row.store_name || initialWebsiteSettings.store_name,
      tagline: row.tagline || initialWebsiteSettings.tagline,
      logo_url: row.logo_url || initialWebsiteSettings.logo_url,
      brand_primary_color: row.brand_primary_color || initialWebsiteSettings.brand_primary_color,
      brand_accent_color: row.brand_accent_color || initialWebsiteSettings.brand_accent_color,
      line_oa_url: row.line_oa_url || initialWebsiteSettings.line_oa_url,
      line_oa_id: row.line_oa_id || initialWebsiteSettings.line_oa_id,
      phone_number: row.phone_number || initialWebsiteSettings.phone_number,
      facebook_url: row.facebook_url || initialWebsiteSettings.facebook_url,
      instagram_url: row.instagram_url || initialWebsiteSettings.instagram_url,
      tiktok_url: row.tiktok_url || initialWebsiteSettings.tiktok_url,
      default_seo_title: row.default_seo_title || initialWebsiteSettings.default_seo_title,
      default_seo_description: row.default_seo_description || initialWebsiteSettings.default_seo_description,
      default_og_image: row.default_og_image || initialWebsiteSettings.default_og_image,
      address: row.address || initialWebsiteSettings.address,
      footer_note: row.footer_note || initialWebsiteSettings.footer_note,
      enable_down_payment: Boolean(row.enable_down_payment),
      default_down_payment_type: row.default_down_payment_type || 'percentage',
      default_down_payment_value: Number(row.default_down_payment_value) || 0,
    };

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Turso get settings error:', error);
    return NextResponse.json(initialWebsiteSettings);
  }
}

export async function POST(req: Request) {
  try {
    const settings: WebsiteSettings = await req.json();

    await turso.execute({
      sql: `INSERT INTO website_settings (
        id, store_name, tagline, logo_url, brand_primary_color, brand_accent_color,
        line_oa_url, line_oa_id, phone_number, facebook_url, instagram_url, tiktok_url,
        default_seo_title, default_seo_description, default_og_image, address, footer_note,
        enable_down_payment, default_down_payment_type, default_down_payment_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        store_name=excluded.store_name,
        tagline=excluded.tagline,
        logo_url=excluded.logo_url,
        brand_primary_color=excluded.brand_primary_color,
        brand_accent_color=excluded.brand_accent_color,
        line_oa_url=excluded.line_oa_url,
        line_oa_id=excluded.line_oa_id,
        phone_number=excluded.phone_number,
        facebook_url=excluded.facebook_url,
        instagram_url=excluded.instagram_url,
        tiktok_url=excluded.tiktok_url,
        default_seo_title=excluded.default_seo_title,
        default_seo_description=excluded.default_seo_description,
        default_og_image=excluded.default_og_image,
        address=excluded.address,
        footer_note=excluded.footer_note,
        enable_down_payment=excluded.enable_down_payment,
        default_down_payment_type=excluded.default_down_payment_type,
        default_down_payment_value=excluded.default_down_payment_value`,
      args: [
        'default',
        settings.store_name,
        settings.tagline || '',
        settings.logo_url || '',
        settings.brand_primary_color || '#000000',
        settings.brand_accent_color || '#111111',
        settings.line_oa_url || '',
        settings.line_oa_id || '',
        settings.phone_number || '',
        settings.facebook_url || '',
        settings.instagram_url || '',
        settings.tiktok_url || '',
        settings.default_seo_title || '',
        settings.default_seo_description || '',
        settings.default_og_image || '',
        settings.address || '',
        settings.footer_note || '',
        settings.enable_down_payment ? 1 : 0,
        settings.default_down_payment_type || 'percentage',
        Number(settings.default_down_payment_value) || 0
      ]
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Turso save settings error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
