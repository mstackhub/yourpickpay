import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'libsql://yourpickpay-mstackhub.aws-ap-northeast-1.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE2MjQxNDksImlkIjoiMDFhMTI1MWUtYTgwMS03MmYwLWIwMWUtYzczNDIzMGQ5ZTlkIiwia2lkIjoiU1ZYRTc1Vy1QcHV4aWQ2RXJ6WlRRTzVNLW5OeVBzX0RjSm5qa0ZycXZ0YyIsInJpZCI6ImE4YWU1ODlhLWRkYjUtNGIxNS1iOTRlLTkzNzc2ZTMyMDY3OSJ9.x7ojB9c724eBh65_4zKMvEof6ZAn8ECLyuOsDwKKknCTHKYZBVcn1IvaufG01Y-HIHrR0IaBXuzLc7FDuKZQCw';

const client = createClient({ url, authToken });

async function clearProducts() {
  console.log('Clearing all products in Turso DB...');
  await client.execute('DELETE FROM products');
  const result = await client.execute('SELECT COUNT(*) as count FROM products');
  console.log('Current product count in Turso DB:', result.rows[0]?.count);
}

clearProducts().catch(console.error);
