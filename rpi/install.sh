#!/bin/bash

#TODO get current username; check that not run as root and get URL and replace it in run.sh

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BIN_DIR="/opt/magic-mirror"

pip3 install -r $SCRIPT_DIR/requirements.txt

sudo apt update && sudo apt upgrade -y
sudo apt install -y epiphany-browser x11-xserver-utils xautomation unclutter

rm -rf $BIN_DIR

mkdir $BIN_DIR

cp -r $SCRIPT_DIR/* $BIN_DIR

chmod -R 0755 $BIN_DIR

mv $BIN_DIR/autostart /home/krenol/.config/lxsession/LXDE-pi/autostart