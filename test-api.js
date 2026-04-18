const https = require('https');

console.log('[TEST] Testing Discord API connectivity...');

https.get('https://discord.com/api/v10/gateway', (res) => {
  console.log(`[TEST] Discord API response: ${res.statusCode}`);
  process.exit(0);
}).on('error', (e) => {
  console.error('[TEST] Discord API connection failed:', e.message);
  process.exit(1);
});
