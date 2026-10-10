import { NextResponse } from 'next/server';
import { turso, isTursoConfigured, seedTursoData } from '@/lib/turso';
import { Category } from '@/types';
import { initialCategories } from '@/lib/mockData';

export async function GET() {
  if (!isTursoConfigured) {
    return NextResponse.json(initialCategories);
  }

  try {
    await seedTursoData();
    const result = await turso.execute('SELECT * FROM categories ORDER BY display_order ASC');
    const categories: Category[] = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      display_order: Number(row.display_order),
      is_active: Boolean(row.is_active),
      created_at: row.created_at,
    }));

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Turso get categories error:', error);
    return NextResponse.json(initialCategories);
  }
}

export async function POST(req: Request) {
  try {
    const category: Category = await req.json();
    const id = category.id || `cat-${Date.now()}`;

    await turso.execute({
      sql: `INSERT INTO categories (id, name, slug, display_order, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name=excluded.name,
              slug=excluded.slug,
              display_order=excluded.display_order,
              is_active=excluded.is_active`,
      args: [
        id,
        category.name,
        category.slug,
        Number(category.display_order) || 1,
        category.is_active ? 1 : 0,
        category.created_at || new Date().toISOString()
      ]
    });

    return NextResponse.json({ success: true, category: { ...category, id } });
  } catch (error: any) {
    console.error('Turso save category error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    await turso.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Turso delete category error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
