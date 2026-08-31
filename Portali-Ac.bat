@echo off
chcp 65001 >nul
rem === DKAB Portal - Python ve VBScript gerektirmeyen basit acici ===
cd /d "%~dp0"
set "DOSYA=%~dp0din-kulturu-tum-siniflar.html"

if not exist "%DOSYA%" (
  echo.
  echo Portal dosyasi bulunamadi:
  echo   %DOSYA%
  echo Bu .bat dosyasi, din-kulturu-tum-siniflar.html ile ayni klasorde olmalidir.
  echo.
  pause
  exit /b
)

set "TARAYICI="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "TARAYICI=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "TARAYICI=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "TARAYICI=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if not defined TARAYICI if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "TARAYICI=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined TARAYICI if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "TARAYICI=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

if defined TARAYICI (
  echo Portal aciliyor...
  start "" "%TARAYICI%" "file:///%DOSYA:\=/%"
) else (
  echo Chrome veya Edge bulunamadi, varsayilan uygulamayla deneniyor...
  start "" "%DOSYA%"
)
exit /b
