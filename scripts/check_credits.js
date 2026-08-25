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

async function checkDetailedSmsStatus() {
  console.log('=== CHECKING SPECIFIC EVENT DETAILS & ACCOUNT CREDITS ===');

  // Check account plan types
  try {
    const res = await fetch('https://api.brevo.com/v3/account', {
      headers: { 'api-key': apiKey, 'accept': 'application/json' }
    });
    const data = await res.json();
    console.log('\nAll plan credits in account:', data.plan);
  } catch (e) {
    console.log(e.message);
  }

  // Check if there is an SMS balance endpoint or senders endpoint
  try {
    const sendersRes = await fetch('https://api.brevo.com/v3/senders', {
      headers: { 'api-key': apiKey, 'accept': 'application/json' }
    });
    console.log('\nSenders (HTTP ' + sendersRes.status + '):', await sendersRes.text());
  } catch (e) {
    console.log(e.message);
  }
}

checkDetailedSmsStatus();
