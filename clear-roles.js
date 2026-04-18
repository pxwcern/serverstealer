// clear-roles.js - Hedef sunucudaki tüm rolleri sil
require('dotenv').config();
const { Client } = require('discord.js');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TARGET_GUILD_ID = process.env.TARGET_GUILD_ID;

if (!BOT_TOKEN || !TARGET_GUILD_ID) {
  console.error('❌ Missing BOT_TOKEN or TARGET_GUILD_ID in .env file');
  process.exit(1);
}

const botClient = new Client({
  intents: 1 | 2 | 8,
});

botClient.on('ready', async () => {
  console.log('🤖 Bot logged in successfully!');
  
  try {
    const targetGuild = await botClient.guilds.fetch(TARGET_GUILD_ID);
    console.log(`🎯 Target guild: ${targetGuild.name}`);
    
    // Rolleri position'a göre azalan sırada sırala (yukarıdan aşağıya sil)
    const roles = Array.from(targetGuild.roles.cache.values())
      .filter(r => r.id !== targetGuild.id && !r.managed)
      .sort((a, b) => b.position - a.position);
    
    console.log(`🗑️ ${roles.length} role silinecek...`);
    
    let deleted = 0;
    for (const role of roles) {
      try {
        await role.delete('Cleanup');
        console.log(`✅ Deleted: ${role.name}`);
        deleted++;
        // Rate limit'i saygıyla karşıla
        await new Promise(res => setTimeout(res, 300));
      } catch (e) {
        console.warn(`⚠️ Failed to delete ${role.name}: ${e.message}`);
      }
    }
    
    console.log(`\n✅ ${deleted}/${roles.length} roles successfully deleted!`);
    await botClient.destroy();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await botClient.destroy();
    process.exit(1);
  }
});

botClient.on('error', err => {
  console.error('❌ Bot error:', err.message);
  process.exit(1);
});

console.log('[DEBUG] Logging in bot...');
botClient.login(BOT_TOKEN);

// Timeout after 180 seconds
setTimeout(() => {
  console.error('⏱️ Timeout - Could not connect to Discord');
  process.exit(1);
}, 180000);
