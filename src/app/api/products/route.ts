import { NextResponse } from 'next/server';
import { turso, isTursoConfigured, seedTursoData } from '@/lib/turso';
import { Product } from '@/types';
import { initialProducts } from '@/lib/mockData';

export async function GET() {
  if (!isTursoConfigured) {
    return NextResponse.json(initialProducts);
  }

  try {
    await seedTursoData();
    const result = await turso.execute('SELECT * FROM products ORDER BY created_at DESC');
    const products: Product[] = result.rows.map((row: any) => ({
      id: row.id,
      sku: row.sku,
      name: row.name,
      brand: row.brand,
      slug: row.slug,
      category_id: row.category_id,
      original_price: Number(row.original_price),
      images: row.images ? JSON.parse(row.images) : [],
      description: row.description,
      down_payment_mode: row.down_payment_mode || 'default',
      down_payment_type: row.down_payment_type || 'percentage',
      down_payment_value: Number(row.down_payment_value) || 0,
      status: row.status,
      seo_title: row.seo_title,
      seo_description: row.seo_description,
      seo_keywords: row.seo_keywords,
      og_image: row.og_image,
      installment_mode: row.installment_mode,
      custom_plan_ids: row.custom_plan_ids ? JSON.parse(row.custom_plan_ids) : [],
      override_plans: row.override_plans ? JSON.parse(row.override_plans) : [],
      sale_page_blocks: row.sale_page_blocks ? JSON.parse(row.sale_page_blocks) : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Turso get products error:', error);
    return NextResponse.json(initialProducts);
  }
}

export async function POST(req: Request) {
  try {
    const product: Product = await req.json();
    const id = product.id || `prod-${Date.now()}`;
    const now = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO products (
        id, sku, name, brand, slug, category_id, original_price, images, description,
        down_payment_mode, down_payment_type, down_payment_value, status,
        seo_title, seo_description, seo_keywords, og_image, installment_mode, custom_plan_ids,
        override_plans, sale_page_blocks, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        sku=excluded.sku,
        name=excluded.name,
        brand=excluded.brand,
        slug=excluded.slug,
        category_id=excluded.category_id,
        original_price=excluded.original_price,
        images=excluded.images,
        description=excluded.description,
        down_payment_mode=excluded.down_payment_mode,
        down_payment_type=excluded.down_payment_type,
        down_payment_value=excluded.down_payment_value,
        status=excluded.status,
        seo_title=excluded.seo_title,
        seo_description=excluded.seo_description,
        seo_keywords=excluded.seo_keywords,
        og_image=excluded.og_image,
        installment_mode=excluded.installment_mode,
        custom_plan_ids=excluded.custom_plan_ids,
        override_plans=excluded.override_plans,
        sale_page_blocks=excluded.sale_page_blocks,
        updated_at=excluded.updated_at`,
      args: [
        id,
        product.sku || '',
        product.name,
        product.brand || '',
        product.slug,
        product.category_id || '',
        Number(product.original_price) || 0,
        JSON.stringify(product.images || []),
        product.description || '',
        product.down_payment_mode || 'default',
        product.down_payment_type || 'percentage',
        Number(product.down_payment_value) || 0,
        product.status || 'published',
        product.seo_title || '',
        product.seo_description || '',
        product.seo_keywords || '',
        product.og_image || '',
        product.installment_mode || 'global',
        JSON.stringify(product.custom_plan_ids || []),
        JSON.stringify(product.override_plans || []),
        JSON.stringify(product.sale_page_blocks || []),
        product.created_at || now,
        now
      ]
    });

    return NextResponse.json({ success: true, product: { ...product, id } });
  } catch (error: any) {
    console.error('Turso save product error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    await turso.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Turso delete product error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
