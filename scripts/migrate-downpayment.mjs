import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'libsql://yourpickpay-mstackhub.aws-ap-northeast-1.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE2MjQxNDksImlkIjoiMDFhMTI1MWUtYTgwMS03MmYwLWIwMWUtYzczNDIzMGQ5ZTlkIiwia2lkIjoiU1ZYRTc1Vy1QcHV4aWQ2RXJ6WlRRTzVNLW5OeVBzX0RjSm5qa0ZycXZ0YyIsInJpZCI6ImE4YWU1ODlhLWRkYjUtNGIxNS1iOTRlLTkzNzc2ZTMyMDY3OSJ9.x7ojB9c724eBh65_4zKMvEof6ZAn8ECLyuOsDwKKknCTHKYZBVcn1IvaufG01Y-HIHrR0IaBXuzLc7FDuKZQCw';

const client = createClient({ url, authToken });

async function migrate() {
  console.log('Running down payment columns migration in Turso...');

  try {
    await client.execute('ALTER TABLE products ADD COLUMN down_payment_mode TEXT DEFAULT "default"');
    console.log('Added down_payment_mode to products');
  } catch (e) {
    console.log('down_payment_mode already exists or:', e.message);
  }

  try {
    await client.execute('ALTER TABLE products ADD COLUMN down_payment_type TEXT DEFAULT "percentage"');
    console.log('Added down_payment_type to products');
  } catch (e) {
    console.log('down_payment_type already exists or:', e.message);
  }

  try {
    await client.execute('ALTER TABLE products ADD COLUMN down_payment_value REAL DEFAULT 0');
    console.log('Added down_payment_value to products');
  } catch (e) {
    console.log('down_payment_value already exists or:', e.message);
  }

  try {
    await client.execute('ALTER TABLE website_settings ADD COLUMN enable_down_payment INTEGER DEFAULT 0');
    console.log('Added enable_down_payment to website_settings');
  } catch (e) {
    console.log('enable_down_payment already exists or:', e.message);
  }

  try {
    await client.execute('ALTER TABLE website_settings ADD COLUMN default_down_payment_type TEXT DEFAULT "percentage"');
    console.log('Added default_down_payment_type to website_settings');
  } catch (e) {
    console.log('default_down_payment_type already exists or:', e.message);
  }

  try {
    await client.execute('ALTER TABLE website_settings ADD COLUMN default_down_payment_value REAL DEFAULT 0');
    console.log('Added default_down_payment_value to website_settings');
  } catch (e) {
    console.log('default_down_payment_value already exists or:', e.message);
  }

  console.log('Migration completed successfully!');
}

migrate().catch(console.error);
