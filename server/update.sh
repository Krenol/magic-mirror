#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BIN_DIR="/opt/magic-mirror"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

sudo systemctl stop magic-mirror-server.service
sudo rm -rf $BIN_DIR
sudo mkdir -p $BIN_DIR
sudo cp -r $PARENT_DIR/* $BIN_DIR
sudo systemctl start magic-mirror-server.service