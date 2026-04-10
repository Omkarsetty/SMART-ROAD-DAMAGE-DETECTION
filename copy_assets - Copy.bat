@echo off
set SRC=C:\Users\medis\.gemini\antigravity\brain\bacf6f03-8dcb-4633-8b70-43d7a4c76d2f
set DEST=c:\Users\medis\Downloads\h\public\dataset

if not exist "%DEST%" mkdir "%DEST%"

copy /y "%SRC%\pothole_1_1775807607492.png" "%DEST%\pothole_1.png"
copy /y "%SRC%\crack_1_1775807629775.png" "%DEST%\crack_1.png"
copy /y "%SRC%\road_view_1_1775807651473.png" "%DEST%\road_view_1.png"

echo Done.
dir "%DEST%"
