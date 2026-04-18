# 🚀 Discord Server Stealer (v2.0)

Gelişmiş Discord sunucu kopyalama ve yönetim aracı. Bu bot, kaynak sunucunun yapısını (kanallar, roller, izinler ve emojiler) yüksek doğlukla hedef sunucuya aktarır.

> [!WARNING]
> **UYARI:** Bu proje yalnızca eğitim ve test amaçlıdır. Self-bot kullanımı Discord Hizmet Şartları'nı ihlal eder ve hesabınızın yasaklanmasına (ban) neden olabilir. Lütfen sorumlu bir şekilde kullanın.

## ✨ Öne Çıkan Özellikler

- **Tam Sunucu Klonlama:** Roller, kategoriler ve kanallar hiyerarşiyi bozmadan kopyalanır.
- **Akıllı Kanal İzinleri:** Kanallara özel rol izinlerini (Permission Overwrites) isim eşleştirme yöntemiyle aktarır.
- **Gelişmiş Emoji Kopyalama:**
  - **Smart Downloader:** Discord CDN hatalarını (`HTTP 415`, `ECONNRESET`) otomatik tespit eder ve formatı (GIF/WebP) değiştirerek tekrar dener.
  - **Random Obfuscation:** Emojileri rastgele isimlerle yükleyerek gizlilik sağlar.
- **Otomatik Temizlik:** Klonlama başlamadan önce hedef sunucudaki eski kanalları ve silinebilir rolleri temizler.
- **Rate Limit Koruması:** Discord'un "yavaşlatma" cezalarına takılmamak için aralarda akıllı bekleme süreleri kullanılır.

---

## 🛠️ Kurulum ve Yapılandırma

### 1. Bağımlılıkları Yükleyin
Node.js (v18+) kurulu olduğundan emin olun ve terminalde çalıştırın:
```bash
npm install
```

### 2. .env Dosyasını Hazırlayın
Ana dizindeki `.env` dosyasını şu bilgilerle doldurun:
```dotenv
ACCOUNT_TOKEN=HESAP_TOKENINIZ   # Kaynak sunucuyu görmek için (Self-bot)
BOT_TOKEN=BOT_TOKENINIZ         # Hedef sunucuya yazmak için (Manager Bot)
SOURCE_GUILD_ID=000000000000    # Kaynak Sunucu ID
TARGET_GUILD_ID=000000000000    # Hedef Sunucu ID
```

> [!IMPORTANT]
> Botun hedef sunucuda **Yönetici (Administrator)** yetkisine sahip olduğundan ve en üstte yer aldığından emin olun.

---

## 🚀 Kullanılabilir Komutlar

Aşağıdaki komutları terminalde çalıştırarak botu yönetebilirsiniz:

| Komut | Açıklama |
| :--- | :--- |
| `npm start` | **Full Clone:** Roller, Kanallar ve Kategorileri tamamen klonlar. |
| `npm run channels` | **Sadece Kanallar:** Kanalları ve izinlerini (overwrites) kopyalar. |
| `npm run emojis` | **Emoji Klonla:** Emojileri temizler ve rastgele isimlerle yeniden yükler. |
| `npm run clear` | **Rol Temizliği:** Hedef sunucudaki silinebilir tüm rolleri temizler. |

---

## 🔍 Teknik Detaylar

- **Hız ve Stabilite:** Bot, büyük sunucularda veri kaybı yaşamamak için `undici` motorunu kullanır ve her işlem arasında (`delay`) bekler.
- **Emoji Format Desteği:** Eğer bir emoji `.gif` olarak indirilemezse, bot otomatik olarak `.webp` formatına dönerek indirmeyi tamamlar.
- **Hiyerarşi Koruma:** Roller ve kanallar `rawPosition` değerine göre sıralanarak orijinal sunucu düzeni birebir korunur.

---

## 🛡️ Sorumluluk Reddi
Bu yazılım "olduğu gibi" sunulmaktadır. Kullanımından kaynaklanan herhangi bir hesap kısıtlamasından geliştirici sorumlu tutulamaz.
