#!/bin/bash

xset -dpms    # Disable DPMS (Energy Star) features
xset s off    # Disable screensaver
xset s noblank # Disable blanking of the video device
firefox --kiosk URL &
python3 /opt/magic-mirror/main.py &
