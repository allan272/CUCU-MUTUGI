import fs from 'fs';
import { POST } from '../src/app/api/orders/route';
import { getStoredDB } from '../src/lib/serverStorage';

// 1. Load environment variables from .env.local
const envPath = 'c:/Users/HP/Documents/CUCUMUTUGI2/CUCU-MUTUGI/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
for (const line of envLines) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    process.env[match[1]] = value.trim();
  }
}

async function runFullOrderFlowTest() {
  console.log('======================================================');
  console.log('TESTING FULL WEBSITE ORDER FLOW & ADMIN PANEL UPDATE');
  console.log('======================================================\n');

  const testOrderId = `ORD-TEST-${Date.now().toString().slice(-4)}`;
  const orderPayload = {
    orderId: testOrderId,
    customerName: 'Mary Wanjiku (Farmer)',
    phone: '0755803918',
    county: 'Kirinyaga',
    productName: 'Kuroiler Chicks',
    qty: 25,
    notes: 'Please deliver on Saturday morning.'
  };

  console.log('1. Submitting test website order...');
  console.log('Payload:', JSON.stringify(orderPayload, null, 2));

  const req = new Request('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });

  const res = await POST(req);
  const data = await res.json();

  console.log('\n2. Order API Response Status:', res.status);
  console.log('Order Details:', {
    id: data.order?.id,
    farmer: data.order?.farmer,
    phone: data.order?.phone,
    product: data.order?.breed,
    qty: data.order?.qty,
    totalKES: data.order?.totalKES
  });

  console.log('\n3. Email Alert Status (Brevo):', data.email);

  console.log('\n4. Verifying DB & Admin Panel State...');
  const db = await getStoredDB();
  const savedOrder = db.orders?.find(o => o.id === testOrderId);
  const latestNotification = db.notifications?.[0];
  const latestTransaction = db.transactions?.[0];

  console.log('   - Order saved in database:', savedOrder ? '✅ YES' : '❌ NO');
  console.log('   - Notification created for Admin:', latestNotification ? `✅ YES ("${latestNotification.title}")` : '❌ NO');
  console.log('   - Income transaction logged:', latestTransaction?.reference === testOrderId ? '✅ YES' : '❌ NO');

  console.log('\n======================================================');
  console.log('TEST RESULT: ' + (savedOrder && data.email?.success ? 'PASS (ALL SYSTEMS OPERATIONAL)' : 'FAIL'));
  console.log('======================================================\n');
}

runFullOrderFlowTest().catch(console.error);
