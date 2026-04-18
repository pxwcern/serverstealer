@echo off
rem ------------------------------------------------------------
rem Discord Sunucu Kopyalama Botu - Tek Komutla Kurulum ve Çalıştırma
rem ------------------------------------------------------------

rem NOTLAR:
rem 1. Bu dosyayı proje klasöründe (setup.bat) çalıştırın.
rem 2. .env dosyasını doldurduğunuzdan emin olun.
rem 3. Node.js LTS (v18+) ve npm kurulu olmalı.
rem 4. npm install → bağımlılıkları kurar.
rem 5. npm start → botu başlatır ve sunucu kopyalar.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%" || (echo [ERROR] Klasöre geçilemedi & exit /b 1)

echo [INFO] Node ve npm sürümleri:
node -v
npm -v

echo [INFO] Bağımlılıklar kuruluyor...
npm install || (echo [ERROR] npm install başarısız & exit /b 1)

echo [INFO] Bot başlatılıyor...
npm start || (echo [ERROR] Bot çalıştırılamadı & exit /b 1)

echo [SUCCESS] Bot başarıyla çalıştı.
pause
rem ------------------------------------------------------------
rem Discord Sunucu Kopyalama Botu - Toplu Kurulum ve Çalıştırma
rem ------------------------------------------------------------

rem ==================== NOTLAR ====================
rem 1. Bu script, proje klasörünün içinde (setup.bat dosyasının bulunduğu dizin) çalıştırılmalıdır.
rem 2. .env dosyasını doldurduğunuzdan emin olun; aksi takdirde bot giriş hatası alırsınız.
rem 3. Node.js LTS (v18+) ve npm kurulu olmalıdır. Sürüm kontrolü sadece bilgi amaçlıdır.
rem 4. npm install komutu, discord.js, discord.js-selfbot-v13 ve dotenv paketlerini kurar.
rem 5. npm start komutu, hem self‑bot hem de normal botu başlatır ve sunucu kopyalama işlemini gerçekleştirir.
rem 6. Hata oluşursa script, ilgili satırda durur ve hata kodunu döndürür; CMD penceresi kapanmaz (pause komutu sayesinde).
rem =================================================

:: Proje klasörünün tam yolunu otomatik olarak al
set "PROJECT_DIR=%~dp0"

:: Klasöre geç
cd /d "%PROJECT_DIR%"
if errorlevel 1 (
  echo [ERROR] Proje klasörüne geçilemedi: %PROJECT_DIR%
  exit /b 1
)

:: Node ve npm sürüm kontrolü (opsiyonel, sadece bilgi amaçlı)
echo [INFO] Node ve npm sürümleri kontrol ediliyor...
node -v
npm -v

:: Bağımlılıkları kur
echo [INFO] npm paketleri kuruluyor...
npm install
if %errorlevel% neq 0 (
  echo [ERROR] npm install işlemi başarısız oldu.
  exit /b %errorlevel%
)

:: Botu başlat
echo [INFO] Bot başlatılıyor (npm start)...
npm start
if %errorlevel% neq 0 (
  echo [ERROR] Bot çalıştırılırken bir hata oluştu.
  exit /b %errorlevel%
)

echo [SUCCESS] Bot başarıyla çalıştı.
pause

rem ------------------------------------------------------------
rem Discord Sunucu Kopyalama Botu - Toplu Kurulum ve Çalıştırma
rem ------------------------------------------------------------

:: Proje klasörünün tam yolunu otomatik olarak al
set "PROJECT_DIR=%~dp0"

:: Klasöre geç
cd /d "%PROJECT_DIR%"
if errorlevel 1 (
  echo [ERROR] Proje klasörüne geçilemedi: %PROJECT_DIR%
  exit /b 1
)

:: Node ve npm sürüm kontrolü (opsiyonel, sadece bilgi amaçlı)
echo [INFO] Node ve npm sürümleri kontrol ediliyor...
node -v
npm -v

:: Bağımlılıkları kur
echo [INFO] npm paketleri kuruluyor...
npm install
if %errorlevel% neq 0 (
  echo [ERROR] npm install işlemi başarısız oldu.
  exit /b %errorlevel%
)

:: Botu başlat
echo [INFO] Bot başlatılıyor (npm start)...
npm start
if %errorlevel% neq 0 (
  echo [ERROR] Bot çalıştırılırken bir hata oluştu.
  exit /b %errorlevel%
)

echo [SUCCESS] Bot başarıyla çalıştı.
pause
