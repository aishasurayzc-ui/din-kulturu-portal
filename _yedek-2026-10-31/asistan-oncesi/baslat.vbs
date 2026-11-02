Option Explicit
' ============================================================
'  DKAB Portal başlatıcı
'  - Yerel sunucuyu, bu betiğin bulunduğu klasörde başlatır.
'  - Python yoksa portalı doğrudan dosyadan açar.
' ============================================================
Dim fso, shell, siteRoot, hedef, url, i

Set fso   = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

' Site kökü = bu betiğin bulunduğu klasör
siteRoot = fso.GetParentFolderName(fso.GetAbsolutePathName(WScript.ScriptFullName))
hedef    = fso.BuildPath(siteRoot, "din-kulturu-tum-siniflar.html")
url      = "http://localhost:8844/din-kulturu-tum-siniflar.html"

If Not fso.FileExists(hedef) Then
  MsgBox "Portal dosyasi bulunamadi:" & vbCrLf & vbCrLf & hedef & vbCrLf & vbCrLf & _
         "baslat.vbs dosyasinin, din-kulturu-tum-siniflar.html ile ayni klasorde olmasi gerekir.", _
         48, "DKAB Portal"
  WScript.Quit
End If

' Sunucu zaten calisiyorsa yeniden baslatma
If Not SunucuHazir(url) Then
  shell.Run "cmd /c cd /d """ & siteRoot & """ && (py -3 -m http.server 8844 || python -m http.server 8844)", 0, False
  For i = 1 To 12            ' en fazla ~6 saniye bekle
    WScript.Sleep 500
    If SunucuHazir(url) Then Exit For
  Next
End If

If SunucuHazir(url) Then
  shell.Run url, 1, False
Else
  ' Python kurulu degil ya da baslatilamadi: portal dosyadan da calisir
  shell.Run """" & hedef & """", 1, False
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
