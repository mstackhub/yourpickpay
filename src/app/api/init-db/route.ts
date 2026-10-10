import { NextResponse } from 'next/server';
import { seedTursoData, initTursoSchema } from '@/lib/turso';

export async function GET() {
  try {
    await seedTursoData();
    return NextResponse.json({ success: true, message: 'Turso schema and seed data initialized successfully' });
  } catch (err: any) {
    console.error('Error initializing Turso:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Database initialization error' }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
