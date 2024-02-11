# SIMPLE QUEUE TOOL GUIDE
## ABOUT
This project is dedicated to everyone who wants to quickly export many elements, such as when creating stock videos where the primary tasks are trimming each clip and making minor edits. The most time-consuming part is often exporting each one.

## HOW TO USE

This plugin isn't officially available in the Adobe Plugins Store. To use it on your PC, you need to first add a registry entry:
### Windows:
1) Open regedit.exe
2) Navigate to HKEY_CURRENT_USER\Software\Adobe\CSXS.11\
3) Create a new entry named: "PlayerDebugMode" 
4) Set the value of the new entry to: "1"

All files will be working after You paste it in plugins directory:
```
C:\Program Files (x86)\Common Files\Adobe\CEP\extensions
```
### MAC:
```sh
defaults write /Users/<userprofile>/Library/Preferences/com.adobe.CSXS.11.plist PlayerDebugMode 1
```
All files will be working after You paste it in plugins directory:
```
Hard Drive/Library/Application Support/Adobe/CEP/extensions/
```
---

The app will be available in Premiere Pro under "Window > Extensions > SIMPLE QUEUE TOOL"