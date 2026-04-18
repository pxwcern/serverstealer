#!/usr/bin/env node
console.log('[TEST] Starting intent validation test...');

try {
  console.log('[TEST] Attempting to load discord.js...');
  const { Client, GatewayIntentBits } = require('discord.js');
  console.log('[TEST] discord.js loaded successfully');
  
  console.log('[TEST] Attempting to create Client with numeric intents (1 | 2 | 8)...');
  const botClient = new Client({
    intents: 1 | 2 | 8,
  });
  console.log('[TEST] ✅ discord.js Client created successfully!');
  
  console.log('[TEST] Attempting to load discord.js-selfbot-v13...');
  const Selfbot = require('discord.js-selfbot-v13');
  console.log('[TEST] discord.js-selfbot-v13 loaded successfully');
  
  console.log('[TEST] Attempting to create Selfbot Client with string intents...');
  const selfClient = new Selfbot.Client({
    checkUpdate: false,
    ws: {
      intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_EMOJIS_AND_STICKERS',
      ],
    },
  });
  console.log('[TEST] ✅ Selfbot Client created successfully!');
  
  console.log('');
  console.log('[SUCCESS] All clients created without errors!');
  console.log('Your index.js should now work correctly.');
  process.exit(0);
} catch (error) {
  console.error('[ERROR]', error.message);
  console.error(error);
  process.exit(1);
}
