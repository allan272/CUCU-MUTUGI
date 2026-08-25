const fs = require('fs');

const envPath = 'c:/Users/HP/Documents/CUCUMUTUGI2/CUCU-MUTUGI/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const env = {};
for (const line of envLines) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
}

async function testBrevoEmail() {
  const apiKey = env.BREVO_API_KEY;
  console.log('Testing Brevo Transactional Email sending...');
  
  const payload = {
    sender: {
      name: 'Cucu Mutugi Poultry',
      email: 'allanbrandon520@gmail.com'
    },
    to: [
      {
        email: 'allanbrandon520@gmail.com',
        name: 'Cucu Mutugi Admin'
      }
    ],
    subject: '🛒 NEW ORDER ALERT: SMS-TEST-001 - Test Chicks (Qty: 10)',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #d97706; margin-top: 0;">🐔 New Chick Order Received!</h2>
        <p>A new order has been placed on the <strong>Cucu Mutugi Poultry</strong> website.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Order ID:</td><td>SMS-TEST-001</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Customer:</td><td>SMS TEST CUSTOMER</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>+254755803918</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Product:</td><td>Test Chicks</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Quantity:</td><td>10</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Total:</td><td>KES 1,200</td></tr>
        </table>
        <div style="margin-top: 25px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">⚡ View & Manage in Admin Portal</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #78350f;">Log in to the Admin Dashboard under the <strong>Orders</strong> tab to update order status.</p>
        </div>
      </div>
    `
  };

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('HTTP Status:', res.status, res.statusText);
    console.log('Response:', data);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

testBrevoEmail();
