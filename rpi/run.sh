#!/bin/sh
export DISPLAY=:0.0
chromium-browser --kiosk --app=URL &
sleep 15s;
xte "key F11"
python3 /opt/magic-mirror/main.py &