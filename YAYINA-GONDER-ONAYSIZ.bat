@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
rem Claude tarafindan 2026-11-02'de olusturuldu: YAYINA-GONDER.bat ile ayni isi
rem onay sormadan yapar ve sonucu yayin-kaydi.txt dosyasina yazar.
echo DKAB PORTALI - YAYINA GONDER (onaysiz) > yayin-kaydi.txt
echo %date% %time% >> yayin-kaydi.txt
where git >> yayin-kaydi.txt 2>&1 || (echo [HATA] git bulunamadi >> yayin-kaydi.txt & goto son)
git status --short >> yayin-kaydi.txt 2>&1
git add -A >> yayin-kaydi.txt 2>&1
git commit -m "Ana sayfa yeni acilis ekrani ve ortak sesli dinleme sistemi (2026-11-02)" >> yayin-kaydi.txt 2>&1
git push origin master >> yayin-kaydi.txt 2>&1
if errorlevel 1 (echo [HATA] GONDERILEMEDI >> yayin-kaydi.txt) else (echo [TAMAM] GONDERILDI >> yayin-kaydi.txt)
:son
type yayin-kaydi.txt
echo.
echo Bu pencereyi kapatabilirsiniz.
pause
