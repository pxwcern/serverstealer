// index.js – Discord Server Cloner
// ------------------------------------------------------------
// WARNING: Using a user (self‑bot) token violates Discord Terms of Service.
// This script is for educational purposes only. Use at your own risk.
// ------------------------------------------------------------

console.log('[DEBUG] Starting bot initialization...');
require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const Selfbot = require('discord.js-selfbot-v13'); // Self‑bot client

// ---------- Self‑bot (account) client ----------
console.log('[DEBUG] Creating selfbot client with intents: GUILDS, GUILD_MEMBERS, GUILD_EMOJIS_AND_STICKERS');
const selfClient = new Selfbot.Client({
  checkUpdate: false,
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_EMOJIS_AND_STICKERS',
  ],
});

// ---------- Regular bot client (will create channels/roles) ----------
console.log('[DEBUG] Creating botClient with intents: 1 | 2 | 8');
const botClient = new Client({
  intents: 1 | 2 | 8, // Guilds, GuildMembers, GuildEmojisAndStickers
  presence: {
    status: 'invisible',
  },
});
console.log('[DEBUG] BotClient created successfully');

// Load environment variables
const ACCOUNT_TOKEN = process.env.ACCOUNT_TOKEN; // User token (self‑bot)
const BOT_TOKEN = process.env.BOT_TOKEN;       // Bot token (regular bot)
const SOURCE_GUILD_ID = process.env.SOURCE_GUILD_ID; // ID of the server to copy
const TARGET_GUILD_ID = process.env.TARGET_GUILD_ID; // ID of the server to receive the copy

if (!ACCOUNT_TOKEN || !BOT_TOKEN || !SOURCE_GUILD_ID || !TARGET_GUILD_ID) {
  console.error('❌ Missing environment variables. Please fill .env file.');
  process.exit(1);
}

// Helper: pause for a short time to respect rate limits
const delay = ms => new Promise(res => setTimeout(res, ms));

// Main cloning function
async function cloneServer() {
  // 1️⃣ Fetch source guild data using the self‑bot
  const sourceGuild = await selfClient.guilds.fetch(SOURCE_GUILD_ID);
  console.log(`🔎 Fetched source guild: ${sourceGuild.name}`);

  // 2️⃣ Fetch target guild using the regular bot
  const targetGuild = await botClient.guilds.fetch(TARGET_GUILD_ID);
  console.log(`🎯 Target guild: ${targetGuild.name}`);

  // --- 🗑️ Cleanup Target Guild ---
  console.log('🗑️ Deleting existing channels...');
  const channelsToDelete = Array.from(targetGuild.channels.cache.values());
  for (const channel of channelsToDelete) {
    try {
      await channel.delete('Cleanup before cloning');
      console.log(`✅ Deleted channel: ${channel.name}`);
      await delay(200);
    } catch (e) {
      console.warn(`⚠️ Failed to delete channel ${channel.name}: ${e.message}`);
    }
  }

  console.log('🗑️ Deleting existing roles...');
  const rolesToDelete = targetGuild.roles.cache.filter(r => r.id !== targetGuild.id && !r.managed);
  for (const [, role] of rolesToDelete) {
    try {
      if (role.editable) {
        await role.delete('Cleanup before cloning');
        console.log(`✅ Deleted role: ${role.name}`);
        await delay(200);
      }
    } catch (e) {
      console.warn(`⚠️ Failed to delete role ${role.name}: ${e.message}`);
    }
  }

  console.log('🗂️ Cloning categories and channels...');
  const categoryMap = new Map();
  const typeMap = {
    'GUILD_TEXT': ChannelType.GuildText,
    'GUILD_VOICE': ChannelType.GuildVoice,
    'GUILD_CATEGORY': ChannelType.GuildCategory,
    'GUILD_NEWS': ChannelType.GuildAnnouncement,
    'GUILD_STAGE_VOICE': ChannelType.GuildStageVoice,
    'GUILD_FORUM': ChannelType.GuildForum,
  };

  const sourceCategories = sourceGuild.channels.cache
    .filter(c => c.type === 'GUILD_CATEGORY')
    .sort((a, b) => a.rawPosition - b.rawPosition);

  for (const [, category] of sourceCategories) {
    try {
      const newCat = await targetGuild.channels.create({
        name: category.name,
        type: ChannelType.GuildCategory,
        reason: 'Cloned category',
      });
      categoryMap.set(category.id, newCat);
      console.log(`✅ Category created: ${category.name}`);
      await delay(200);
    } catch (e) {
      console.warn(`⚠️ Failed to create category ${category.name}: ${e.message}`);
    }
  }

  const sourceChannels = sourceGuild.channels.cache
    .filter(c => c.type !== 'GUILD_CATEGORY')
    .sort((a, b) => a.rawPosition - b.rawPosition);

  for (const [, channel] of sourceChannels) {
    try {
      const parent = channel.parentId ? categoryMap.get(channel.parentId) : null;
      
      await targetGuild.channels.create({
        name: channel.name,
        type: typeMap[channel.type] || ChannelType.GuildText,
        topic: channel.topic,
        nsfw: channel.nsfw,
        bitrate: channel.bitrate,
        userLimit: channel.userLimit,
        parent: parent || null,
        reason: 'Cloned channel',
      });
      console.log(`✅ Channel created: ${channel.name}`);
      await delay(200);
    } catch (e) {
      console.warn(`⚠️ Failed to create channel ${channel.name}: ${e.message}`);
    }
  }

  // --- 🛠️ Clone Roles ---
  console.log('🛠️ Cloning roles...');
  const sourceRoles = sourceGuild.roles.cache.filter(r => r.id !== sourceGuild.id && !r.managed);
  // Rolleri position'a göre sırala (yukarıdan aşağıya doğru oluşturmak için)
  const sortedRoles = Array.from(sourceRoles.values()).sort((a, b) => b.position - a.position);
  
  for (const role of sortedRoles) {
    try {
      // Convert permissions bitfield to proper format
      const permissionBitfield = typeof role.permissions.bitfield === 'bigint' 
        ? role.permissions.bitfield.toString()
        : role.permissions.bitfield || 0;
      
      await targetGuild.roles.create({
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        permissions: permissionBitfield,
        mentionable: role.mentionable,
        reason: 'Cloned from source server',
      });
      console.log(`✅ Role created: ${role.name}`);
      await delay(200);
    } catch (e) {
      console.warn(`⚠️ Failed to create role ${role.name}: ${e.message}`);
    }
  }

  console.log('✅ Server cloning completed!');
  process.exit(0);
}

// ---------- Login sequence ----------
console.log('[DEBUG] Attempting to login selfClient...');
console.log(`[DEBUG] Account token length: ${ACCOUNT_TOKEN?.length || 'undefined'}`);
console.log(`[DEBUG] Bot token length: ${BOT_TOKEN?.length || 'undefined'}`);

let selfbotReady = false;
let botReady = false;
let loginTimeout = null;

// Setup selfbot handlers
selfClient.on('ready', () => {
  if (loginTimeout) clearTimeout(loginTimeout);
  selfbotReady = true;
  console.log('🔐 Self‑bot logged in successfully!');
  
  // Now login the regular bot after a short delay
  setTimeout(() => {
    console.log('[DEBUG] Now attempting to login botClient...');
    botClient.login(BOT_TOKEN).catch(err => {
      console.error('❌ Bot login error:', err.message);
      process.exit(1);
    });
  }, 2000);
});

selfClient.on('error', err => {
  if (loginTimeout) clearTimeout(loginTimeout);
  console.error('❌ Self‑bot error event:', err.message);
  console.error('Full error:', err);
});

selfClient.on('disconnect', (err) => {
  console.warn('⚠️ Selfbot disconnected:', err?.message || 'no reason');
});

// Setup botClient handlers
botClient.on('ready', () => {
  if (loginTimeout) clearTimeout(loginTimeout);
  botReady = true;
  console.log('🤖 Bot logged in successfully!');
  console.log('[DEBUG] Starting clone server function...');
  cloneServer().catch(err => {
    console.error('❌ Clone server error:', err.message);
    process.exit(1);
  });
});

botClient.on('error', err => {
  console.error('❌ Bot error event:', err.message);
});

// Start the login process
console.log('[DEBUG] Starting selfbot login with account token...');
selfClient.login(ACCOUNT_TOKEN);

// Add overall timeout in case both clients fail
loginTimeout = setTimeout(() => {
  console.error('⏱️ Login timeout after 60 seconds');
  console.error('Check your tokens and Discord connection');
  process.exit(1);
}, 60000);
