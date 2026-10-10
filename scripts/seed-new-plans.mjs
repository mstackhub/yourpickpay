import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'libsql://yourpickpay-mstackhub.aws-ap-northeast-1.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE2MjQxNDksImlkIjoiMDFhMTI1MWUtYTgwMS03MmYwLWIwMWUtYzczNDIzMGQ5ZTlkIiwia2lkIjoiU1ZYRTc1Vy1QcHV4aWQ2RXJ6WlRRTzVNLW5OeVBzX0RjSm5qa0ZycXZ0YyIsInJpZCI6ImE4YWU1ODlhLWRkYjUtNGIxNS1iOTRlLTkzNzc2ZTMyMDY3OSJ9.x7ojB9c724eBh65_4zKMvEof6ZAn8ECLyuOsDwKKknCTHKYZBVcn1IvaufG01Y-HIHrR0IaBXuzLc7FDuKZQCw';

const client = createClient({ url, authToken });

const newPlans = [
  {
    id: 'plan-8',
    name: 'ผ่อนรายสัปดาห์ 2 เดือน (9 สัปดาห์)',
    duration_months: 2,
    frequency: 'weekly',
    markup_type: 'percentage',
    markup_value: 10,
    is_active: 1,
    is_default: 1,
    display_order: 8,
  },
  {
    id: 'plan-9',
    name: 'ผ่อนรายเดือน 2 เดือน (2 งวด)',
    duration_months: 2,
    frequency: 'monthly',
    markup_type: 'percentage',
    markup_value: 10,
    is_active: 1,
    is_default: 1,
    display_order: 9,
  }
];

async function updatePlans() {
  const now = new Date().toISOString();
  for (const p of newPlans) {
    await client.execute({
      sql: `INSERT INTO installment_plans (
        id, name, duration_months, frequency, markup_type, markup_value, is_active, is_default, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        duration_months=excluded.duration_months,
        frequency=excluded.frequency,
        markup_type=excluded.markup_type,
        markup_value=excluded.markup_value,
        is_active=excluded.is_active,
        is_default=excluded.is_default,
        display_order=excluded.display_order,
        updated_at=excluded.updated_at`,
      args: [p.id, p.name, p.duration_months, p.frequency, p.markup_type, p.markup_value, p.is_active, p.is_default, p.display_order, now, now]
    });
    console.log(`Updated plan ${p.id}`);
  }
}

updatePlans().catch(console.error);
