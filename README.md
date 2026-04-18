# 🚀 Discord Server Stealer (v2.0)

An advanced Discord server cloning and management tool. This bot transfers the source server’s structure (channels, roles, permissions and emojis) to the target server with high accuracy.

> [!WARNING]
> **WARNING:** This project is for educational and testing purposes only. Using a self-bot violates the Discord Terms of Service and may result in your account being banned. Please use responsibly.

## ✨ Key Features

- **Full Server Cloning:** Roles, categories and channels are copied without disrupting the hierarchy.
- **Smart Channel Permissions:** Transfers channel-specific role permissions (Permission Overwrites) using a name-matching method.
- **Advanced Emoji Cloning:**
  - **Smart Downloader:** Automatically detects Discord CDN errors (`HTTP 415`, `ECONNRESET`) and retries by changing the format (GIF/WebP).
  - **Random Obfuscation:** Ensures privacy by uploading emojis with randomised names.
- **Automatic Cleanup:** Clears old channels and deletable roles on the target server before cloning begins.
- **Rate Limit Protection:** Uses smart waiting intervals to avoid triggering Discord’s “throttling” penalties.

---

## 🛠️ Installation and Configuration

### 1. Install Dependencies
Ensure Node.js (v18+) is installed and run the following in the terminal:
```bash
npm install
```

### 2. Prepare the .env File
Fill in the `.env` file in the root directory with the following information:
```dotenv
ACCOUNT_TOKEN=YOUR_ACCOUNT_TOKEN   # To view the source server (Self-bot)
BOT_TOKEN=YOUR_BOT_TOKEN         # To post to the target server (Manager Bot)
SOURCE_GUILD_ID=000000000000    # Source Server ID
TARGET_GUILD_ID=000000000000    # Target Server ID
```

> [!IMPORTANT]
> Ensure the bot has **Administrator** privileges on the target server and is at the top of the list.

---

## 🚀 Available Commands

You can manage the bot by running the following commands in the terminal:

| Command | Description |
| :--- | :--- |
| `npm start` | **Full Clone:** Fully clones Roles, Channels and Categories. |
| `npm run channels` | **Channels Only:** Copies channels and their permissions (overwrites). |
| `npm run emojis` | **Clone Emojis:** Clears emojis and reloads them with random names. |
| `npm run clear` | **Role Cleanup:** Clears all deletable roles on the target server. |

---

## 🔍 Technical Details

- **Speed and Stability:** The bot uses the `undici` engine to avoid data loss on large servers and waits for a `delay` between each operation.
- **Emoji Format Support:** If an emoji cannot be downloaded as a `.gif`, the bot automatically switches to the `.webp` format to complete the download.
- **Hierarchy Preservation:** Roles and channels are sorted according to the `rawPosition` value, ensuring the original server structure is preserved exactly.

---

## 🛡️ Disclaimer
This software is provided ‘as is’. The developer cannot be held liable for any account restrictions arising from its use.


Translated with DeepL.com (free version)
