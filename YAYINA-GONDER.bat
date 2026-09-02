@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo.
echo ============================================================
echo   DKAB PORTALI - YAYINA GONDER
echo   github.com/aishasurayzc-ui/din-kulturu-portal  (master)
echo ============================================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [HATA] Bilgisayarinizda git bulunamadi.
  echo        https://git-scm.com/download/win adresinden kurup tekrar deneyin.
  echo.
  pause
  exit /b 1
)

echo Gonderilecek degisiklikler:
echo ------------------------------------------------------------
git status --short
echo ------------------------------------------------------------
echo.

git diff --quiet && git diff --cached --quiet
if not errorlevel 1 (
  echo Gonderilecek bir degisiklik yok. Her sey zaten yayinda.
  echo.
  pause
  exit /b 0
)

set /p ONAY="Bu degisiklikler yayina gonderilsin mi? (E/H): "
if /i not "%ONAY%"=="E" (
  echo.
  echo Iptal edildi. Hicbir sey gonderilmedi.
  echo.
  pause
  exit /b 0
)

echo.
echo [1/3] Dosyalar hazirlaniyor...
git add -A
if errorlevel 1 goto hata

echo [2/3] Kayit olusturuluyor...
git commit -F "gonder-mesaji.txt"
if errorlevel 1 goto hata

echo [3/3] GitHub'a gonderiliyor...
git push origin master
if errorlevel 1 goto pushhata

echo.
echo ============================================================
echo   TAMAM. Degisiklikler gonderildi.
echo   Site birkac dakika icinde guncellenir:
echo   https://aishasurayzc-ui.github.io/din-kulturu-portal/
echo ============================================================
echo.
pause
exit /b 0

:pushhata
echo.
echo [HATA] Gonderme basarisiz oldu.
echo.
echo   En sik sebep: GitHub kullanici adi/parola (token) istenmesi.
echo   - Acilan pencerede GitHub hesabinizla giris yapin.
echo   - Parola yerine "Personal Access Token" isteyebilir.
echo.
echo   Kayit olusturuldu ama gonderilmedi. Sorunu cozunce
echo   bu dosyayi tekrar calistirmaniz yeterli.
echo.
pause
exit /b 1

:hata
echo.
echo [HATA] Islem yarida kesildi. Yukaridaki mesaja bakin.
echo.
pause
exit /b 1
