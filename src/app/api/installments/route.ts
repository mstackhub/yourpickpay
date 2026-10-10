import { NextResponse } from 'next/server';
import { turso, isTursoConfigured, seedTursoData } from '@/lib/turso';
import { InstallmentPlan } from '@/types';
import { initialInstallmentPlans } from '@/lib/mockData';

export async function GET() {
  if (!isTursoConfigured) {
    return NextResponse.json(initialInstallmentPlans);
  }

  try {
    await seedTursoData();
    const result = await turso.execute('SELECT * FROM installment_plans ORDER BY display_order ASC');
    const plans: InstallmentPlan[] = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      duration_months: Number(row.duration_months),
      frequency: row.frequency,
      markup_type: row.markup_type,
      markup_value: Number(row.markup_value),
      fixed_amount_per_period: row.fixed_amount_per_period ? Number(row.fixed_amount_per_period) : undefined,
      is_active: Boolean(row.is_active),
      is_default: Boolean(row.is_default),
      display_order: Number(row.display_order),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json(plans);
  } catch (error: any) {
    console.error('Turso get installments error:', error);
    return NextResponse.json(initialInstallmentPlans);
  }
}

export async function POST(req: Request) {
  try {
    const plan: InstallmentPlan = await req.json();
    const id = plan.id || `plan-${Date.now()}`;
    const now = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO installment_plans (
        id, name, duration_months, frequency, markup_type, markup_value,
        fixed_amount_per_period, is_active, is_default, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        duration_months=excluded.duration_months,
        frequency=excluded.frequency,
        markup_type=excluded.markup_type,
        markup_value=excluded.markup_value,
        fixed_amount_per_period=excluded.fixed_amount_per_period,
        is_active=excluded.is_active,
        is_default=excluded.is_default,
        display_order=excluded.display_order,
        updated_at=excluded.updated_at`,
      args: [
        id,
        plan.name,
        Number(plan.duration_months),
        plan.frequency,
        plan.markup_type || 'percentage',
        Number(plan.markup_value) || 0,
        plan.fixed_amount_per_period ? Number(plan.fixed_amount_per_period) : null,
        plan.is_active ? 1 : 0,
        plan.is_default ? 1 : 0,
        Number(plan.display_order) || 1,
        plan.created_at || now,
        now
      ]
    });

    return NextResponse.json({ success: true, plan: { ...plan, id } });
  } catch (error: any) {
    console.error('Turso save installment plan error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    await turso.execute({
      sql: 'DELETE FROM installment_plans WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Turso delete installment plan error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
