Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

desktopPath = fso.GetParentFolderName(fso.GetAbsolutePathName(WScript.ScriptFullName))
desktopPath = fso.GetParentFolderName(desktopPath)

shell.CurrentDirectory = desktopPath
shell.Run "cmd /c cd /d """ & desktopPath & """ && python -m http.server 8844", 0, False

WScript.Sleep 1500

shell.Run "http://localhost:8844/din-kulturu-tum-siniflar.html", 1, False
