#!/bin/sh
export DISPLAY=:0.0
epiphany-browser -a -i --profile ~/.config https://google.com &
sleep 15s;
xte "key F11"
python3 /opt/magic-mirror/main.py &