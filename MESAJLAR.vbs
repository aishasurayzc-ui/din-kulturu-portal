Option Explicit
' ============================================================
'  DKAB Portal - OGRETMEN MESAJLAR MERKEZI (2026-11-14)
'  Ogrencilerin "Bana Sor -> Ogretmene Sor" ile gonderdigi sorulari acar.
'  - Yerel sunucu calismiyorsa baslatir (baslat.vbs ile ayni yontem).
'  - Python yoksa paneli internetteki portal adresinden acar.
' ============================================================
Dim fso, shell, siteRoot, hedef, url, cevrimici, i

Set fso   = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

siteRoot  = fso.GetParentFolderName(fso.GetAbsolutePathName(WScript.ScriptFullName))
hedef     = fso.BuildPath(siteRoot, "ogretmen-mesajlar.html")
url       = "http://localhost:8844/ogretmen-mesajlar.html"
cevrimici = "https://aishasurayzc-ui.github.io/din-kulturu-portal/ogretmen-mesajlar.html"

If Not fso.FileExists(hedef) Then
  MsgBox "Mesajlar paneli bulunamadi:" & vbCrLf & vbCrLf & hedef, 48, "DKAB Mesajlar"
  WScript.Quit
End If

If Not SunucuHazir(url) Then
  shell.Run "cmd /c cd /d """ & siteRoot & """ && (py -3 asistan-sunucu.py 8844 || python asistan-sunucu.py 8844 || py -3 -m http.server 8844 || python -m http.server 8844)", 0, False
  For i = 1 To 12
    WScript.Sleep 500
    If SunucuHazir(url) Then Exit For
  Next
End If

If SunucuHazir(url) Then
  shell.Run url, 1, False
Else
  shell.Run cevrimici, 1, False
End If

Function SunucuHazir(adres)
  Dim h
  SunucuHazir = False
  On Error Resume Next
  Set h = CreateObject("MSXML2.ServerXMLHTTP.6.0")
  If Err.Number <> 0 Then Exit Function
  h.SetTimeouts 1000, 1000, 1500, 1500
  h.Open "GET", adres, False
  h.Send
  If Err.Number = 0 Then
    If h.Status = 200 Then SunucuHazir = True
  End If
  Err.Clear
  On Error GoTo 0
End Function
