import fs from 'fs';
import path from 'path';
import { normalizePhoneNumber, formatKenyanPhone, sendBrevoSms } from '../src/lib/brevoSms';
import { getAdminRecipients, broadcastAdminMessage } from '../src/lib/outboundMessaging';
import { POST } from '../src/app/api/orders/route';


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

async function runEndToEndVerification() {
  console.log('====================================================');
  console.log('BREVO SMS END-TO-END VERIFICATION SUITE');
  console.log('====================================================\n');

  // ---------------------------------------------------------------
  // LAYER A: Phone Normalization Test
  // ---------------------------------------------------------------
  console.log('>>> LAYER A: Phone Normalization Tests');
  
  const testCases = [
    { input: '0755803918', expected: '+254755803918' },
    { input: '0706972161', expected: '+254706972161' },
    { input: '0719303786', expected: '+254719303786' },
    { input: '+254755803918', expected: '+254755803918' },
    { input: '254755803918', expected: '+254755803918' },
    { input: '+2540755803918', expected: '+254755803918' },
    { input: '2540755803918', expected: '+254755803918' },
    { input: '0755 803 918', expected: '+254755803918' },
  ];

  let layerAPass = true;
  for (const tc of testCases) {
    const result = normalizePhoneNumber(tc.input);
    const pass = result === tc.expected;
    if (!pass) layerAPass = false;
    console.log(`  ${pass ? '✅' : '❌'} ${tc.input.padEnd(16)} -> ${result.padEnd(16)} (Expected: ${tc.expected})`);
  }
  console.log(`Layer A Result: ${layerAPass ? 'PASS' : 'FAIL'}\n`);

  // ---------------------------------------------------------------
  // LAYER B: Brevo Authentication
  // ---------------------------------------------------------------
  console.log('>>> LAYER B: Brevo Authentication');
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.log('  ❌ Missing BREVO_API_KEY');
    return;
  }
  console.log('  BREVO_API_KEY Present: YES (length: ' + apiKey.length + ')');
  
  let layerBPass = false;
  try {
    const authRes = await fetch('https://api.brevo.com/v3/account', {
      headers: {
        'api-key': apiKey,
        'accept': 'application/json'
      }
    });
    if (authRes.ok) {
      const data = await authRes.json();
      console.log(`  ✅ Brevo Authenticated successfully. HTTP ${authRes.status}. Email: ${data.email}`);
      layerBPass = true;
    } else {
      console.log(`  ❌ Brevo Auth failed. HTTP ${authRes.status}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  ❌ Brevo Auth network error: ${msg}`);
  }
  console.log(`Layer B Result: ${layerBPass ? 'PASS' : 'FAIL'}\n`);

  // ---------------------------------------------------------------
  // LAYER C: Admin Recipients Configuration & Direct SMS
  // ---------------------------------------------------------------
  console.log('>>> LAYER C: Admin Configuration & Direct SMS');
  const adminRecipients = getAdminRecipients();
  console.log('  Configured Admin Recipients:', adminRecipients);
  
  const expectedAdmins = ['+254706972161', '+254719303786'];
  const hasBothAdmins = expectedAdmins.every(admin => adminRecipients.includes(admin));
  const excludesCustomer = !adminRecipients.includes('+254755803918');

  console.log(`  Main Admin (+254706972161) configured: ${adminRecipients.includes('+254706972161') ? '✅' : '❌'}`);
  console.log(`  Secondary Admin (+254719303786) configured: ${adminRecipients.includes('+254719303786') ? '✅' : '❌'}`);
  console.log(`  Customer number (+254755803918) excluded from admin broadcast: ${excludesCustomer ? '✅' : '❌'}`);

  // ---------------------------------------------------------------
  // LAYER D: Controlled Test Order Creation & Order-Triggered SMS
  // ---------------------------------------------------------------
  console.log('\n>>> LAYER D: Controlled Test Order & Order-Triggered Real SMS');
  
  const testOrderPayload = {
    orderId: 'SMS-TEST-001',
    customerName: 'SMS TEST CUSTOMER',
    phone: '0755803918',
    productName: 'Test Chicks',
    qty: 10,
    county: 'Embu',
    notes: 'Brevo SMS integration end-to-end test'
  };

  const req = new Request('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrderPayload)
  });

  const response = await POST(req);
  const responseData = await response.json();
  
  console.log('Order API HTTP Status:', response.status);
  console.log('Order Creation Response:\n', JSON.stringify(responseData, null, 2));

  console.log('\n====================================================');
  console.log('DETAILED VERIFICATION BREAKDOWN');
  console.log('====================================================');

  const mainAdminSms = responseData.adminBroadcast?.sms?.find((s: { recipient: string }) => s.recipient === '+254706972161');
  const secondaryAdminSms = responseData.adminBroadcast?.sms?.find((s: { recipient: string }) => s.recipient === '+254719303786');

  console.log('Order Creation:', response.status === 200 ? 'PASS' : 'FAIL');
  console.log('Phone Normalization (Customer 0755803918 -> +254755803918):', responseData.order?.phone === '+254755803918' ? 'PASS' : 'FAIL');
  console.log('Brevo Authentication:', layerBPass ? 'PASS' : 'FAIL');
  console.log('Main Admin SMS (+254706972161):', mainAdminSms?.success ? `PASS (Message ID: ${mainAdminSms.messageId})` : `FAIL (${mainAdminSms?.error})`);
  console.log('Secondary Admin SMS (+254719303786):', secondaryAdminSms?.success ? `PASS (Message ID: ${secondaryAdminSms.messageId})` : `FAIL (${secondaryAdminSms?.error})`);
  console.log('Order-triggered SMS:', (mainAdminSms?.success && secondaryAdminSms?.success) ? 'PASS' : 'FAIL');
}

runEndToEndVerification().catch(console.error);
