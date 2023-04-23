#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

pip3 install -r requirements.txt

rm -rf /opt/magic-mirror

mkdir /opt/magic-mirror

cp -r $SCRIPT_DIR/* /opt/magic-mirror

# Copy the service file to the systemd directory
cp magic-mirror.service /etc/systemd/system/

# Reload the systemd daemon to load the new service file
systemctl daemon-reload

# Start the new service
systemctl start magic-mirror.service

# Enable the service to start automatically at boot
systemctl enable magic-mirror.service
