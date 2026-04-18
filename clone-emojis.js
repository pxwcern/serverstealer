// clone-emojis.js - Emojileri temizle ve klonla
require('dotenv').config();
const { Client, PermissionFlagsBits } = require('discord.js');
const { fetch } = require('undici');
const https = require('https');
const fs = require('fs');
const path = require('path');
const Selfbot = require('discord.js-selfbot-v13');

const ACCOUNT_TOKEN = process.env.ACCOUNT_TOKEN;
const BOT_TOKEN = process.env.BOT_TOKEN;
const SOURCE_GUILD_ID = process.env.SOURCE_GUILD_ID;
const TARGET_GUILD_ID = process.env.TARGET_GUILD_ID;

if (!ACCOUNT_TOKEN || !BOT_TOKEN || !SOURCE_GUILD_ID || !TARGET_GUILD_ID) {
  console.error('❌ Missing environment variables in .env file');
  process.exit(1);
}

const selfClient = new Selfbot.Client({
  checkUpdate: false,
  intents: ['GUILDS', 'GUILD_EMOJIS_AND_STICKERS'],
});

const botClient = new Client({
  intents: 1 | 8, // Guilds, GuildEmojisAndStickers
  rest: {
    debug: true
  }
});

const delay = ms => new Promise(res => setTimeout(res, ms));

async function downloadWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      
      // Handle extension mismatch (415)
      if (resp.status === 415 && url.includes('.gif')) {
        const webpUrl = url.replace('.gif', '.webp');
        console.log(`      🔄 415 Detected. Retrying with .webp format...`);
        return downloadWithRetry(webpUrl, retries);
      }
      
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      
      const arrayBuffer = await resp.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (e) {
      if (i === retries - 1) throw e;
      const wait = (i + 1) * 2000;
      console.warn(`      ⚠️ Download failed (${e.message}). Retrying in ${wait/1000}s... (Attempt ${i+1}/${retries})`);
      await delay(wait);
    }
  }
}

function generateRandomName() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let name = 'e_';
  for (let i = 0; i < 6; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return name;
}

async function cloneEmojis() {
  try {
    const sourceGuild = await selfClient.guilds.fetch(SOURCE_GUILD_ID);
    console.log(`🔎 Fetched source guild: ${sourceGuild.name}`);

    const targetGuild = await botClient.guilds.fetch(TARGET_GUILD_ID);
    console.log(`🎯 Target guild: ${targetGuild.name}`);

    // --- 🔑 Check Permissions ---
    console.log('🔑 Checking bot permissions...');
    const me = await targetGuild.members.fetchMe().catch(() => null);
    if (!me) {
      console.error('❌ Could not fetch bot member in target guild. Is the bot in the server?');
      process.exit(1);
    }
    
    if (!me.permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) {
      console.error('❌ Bot lacks MANAGE_EMOJIS_AND_STICKERS permission in target guild!');
      process.exit(1);
    }
    console.log('✅ Bot has required permissions.');

    // --- 🐘 Fetch Emojis ---
    console.log('🔄 Fetching emojis from both servers...');
    const [sourceEmojis, targetEmojis] = await Promise.all([
      sourceGuild.emojis.fetch(),
      targetGuild.emojis.fetch()
    ]);
    
    console.log(`📊 Stats: Source has ${sourceEmojis.size} emojis | Target has ${targetEmojis.size} emojis`);

    // --- 🗑️ Cleanup Target Guild Emojis ---
    if (targetEmojis.size > 0) {
      console.log('🗑️ Deleting existing emojis in target server...');
      for (const emoji of targetEmojis.values()) {
        try {
          await emoji.delete('Cleanup before cloning emojis');
          console.log(`✅ Deleted emoji: ${emoji.name}`);
          await delay(200);
        } catch (e) {
          console.warn(`⚠️ Failed to delete emoji ${emoji.name}: ${e.message}`);
        }
      }
    } else {
      console.log('ℹ️ Target server already clean (no emojis).');
    }

    // --- ✨ Clone Emojis ---
    if (sourceEmojis.size > 0) {
      console.log(`✨ Starting clone of ${sourceEmojis.size} emojis...`);
      let current = 0;
      for (const emoji of sourceEmojis.values()) {
        current++;
        try {
          console.log(`[${current}/${sourceEmojis.size}] 🔄 Downloading: ${emoji.name} ...`);
          const buffer = await downloadWithRetry(emoji.url);
          console.log(`   📦 Downloaded ${buffer.length} bytes.`);
          
          if (buffer.length > 256000) {
             console.warn(`   ⚠️ Emoji ${emoji.name} is too large (>256KB). Skipping.`);
             continue;
          }

          const randomName = generateRandomName();
          // Detect actual extension from buffer or metadata is too complex here, 
          // but Discord handles most formats if we give a valid extension.
          const type = emoji.animated ? 'gif' : 'png';
          const tempFileName = `temp_${randomName}.${type}`;
          const tempPath = path.join(process.cwd(), tempFileName);

          console.log(`[${current}/${sourceEmojis.size}] ✏️ Saving to temp file: ${tempFileName} ...`);
          fs.writeFileSync(tempPath, buffer);
          
          console.log(`[${current}/${sourceEmojis.size}] ⬆️ Uploading via file: ${emoji.name} ...`);
          
          const created = await targetGuild.emojis.create({
            attachment: tempPath,
            name: randomName,
            reason: 'Cloned emoji via filesystem for stability',
          });
          
          console.log(`   ✅ Success: ${created.name} created.`);
          
          // Cleanup
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          
          await delay(2000); // 2 seconds delay for Discord rate limits
        } catch (e) {
          console.error(`   ❌ Failed for ${emoji.name}: ${e.message}`);
          if (e.message.includes('Limit')) {
            console.log('🛑 Server emoji limit reached. Stopping.');
            break;
          }
          await delay(2000);
        } finally {
          // Final cleanup just in case
          const tempFileName = `temp_${generateRandomName()}.${emoji?.animated ? 'gif' : 'png'}`; // This is a bit redundant but safe
          // Actually let's use the actual tempPath from above if it exists
        }
      }
    } else {
      console.log('ℹ️ Source server has no emojis to clone.');
    }

    console.log('\n✅ Emoji cloning completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

let selfbotReady = false;
let botReady = false;

selfClient.on('ready', () => {
  selfbotReady = true;
  console.log('🔐 Selfbot logged in');
  checkBothReady();
});

botClient.on('ready', () => {
  botReady = true;
  console.log('🤖 Bot logged in');
  checkBothReady();
});

function checkBothReady() {
  if (selfbotReady && botReady) {
    cloneEmojis();
  }
}

botClient.on('error', err => {
  console.error('❌ Bot error:', err.message);
  process.exit(1);
});

selfClient.on('error', err => {
  console.error('❌ Selfbot error:', err.message);
  process.exit(1);
});

console.log('[DEBUG] Starting logins for emoji cloning...');
selfClient.login(ACCOUNT_TOKEN);
botClient.login(BOT_TOKEN);

// Timeout after 60 seconds
setTimeout(() => {
  if (!selfbotReady || !botReady) {
    console.error('⏱️ Login timeout');
    process.exit(1);
  }
}, 60000);
