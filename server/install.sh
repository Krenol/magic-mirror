#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BIN_DIR="/opt/magic-mirror"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

sudo rm -rf $BIN_DIR
sudo mkdir -p $BIN_DIR
sudo cp -r $PARENT_DIR/* $BIN_DIR

sudo sed -i "s|WORKDIR|$BIN_DIR|" $SCRIPT_DIR/magic-mirror-server.service
sudo mv $SCRIPT_DIR/magic-mirror-server.service /etc/systemd/system/magic-mirror-server.service
sudo systemctl daemon-reload
sudo systemctl enable magic-mirror-server.service
sudo systemctl start magic-mirror-server.service