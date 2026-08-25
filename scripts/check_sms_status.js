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

const apiKey = env.BREVO_API_KEY;

async function checkSmsEvents() {
  console.log('=== CHECKING BREVO SMS EVENTS & STATUS ===');
  
  // 1. Check account details again (specifically looking for SMS credits)
  try {
    const accRes = await fetch('https://api.brevo.com/v3/account', {
      headers: { 'api-key': apiKey, 'accept': 'application/json' }
    });
    const accData = await accRes.json();
    console.log('\n--- Account Details ---');
    console.log('Plan:', JSON.stringify(accData.plan, null, 2));
    console.log('Relay / SMS details:', JSON.stringify(accData.relay || {}, null, 2));
  } catch (e) {
    console.log('Account fetch error:', e.message);
  }

  // 2. Query transactional SMS events
  try {
    const eventsRes = await fetch('https://api.brevo.com/v3/transactionalSMS/statistics/events?limit=20', {
      headers: { 'api-key': apiKey, 'accept': 'application/json' }
    });
    console.log('\n--- SMS Events (HTTP ' + eventsRes.status + ') ---');
    const eventsData = await eventsRes.json();
    console.log(JSON.stringify(eventsData, null, 2));
  } catch (e) {
    console.log('Events fetch error:', e.message);
  }

  // 3. Query transactional SMS aggregated reports
  try {
    const statsRes = await fetch('https://api.brevo.com/v3/transactionalSMS/statistics/aggregatedReport', {
      headers: { 'api-key': apiKey, 'accept': 'application/json' }
    });
    console.log('\n--- Aggregated SMS Stats (HTTP ' + statsRes.status + ') ---');
    const statsData = await statsRes.json();
    console.log(JSON.stringify(statsData, null, 2));
  } catch (e) {
    console.log('Stats fetch error:', e.message);
  }
}

checkSmsEvents();
