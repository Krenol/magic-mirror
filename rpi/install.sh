#!/bin/bash

#TODO get current username; check that not run as root and get URL and replace it in run.sh

if [[ "$EUID" = 0 ]]; then
    echo "Script must not be run as root"
    exit 1
fi

echo "Enter server URL: "  
read SERVER_URL

URL_REGEX='(https?)://[-[:alnum:]\+&@#/%?=~_|!:,.;]*[-[:alnum:]\+&@#/%=~_|]'

if [[ $SERVER_URL =~ $URL_REGEX ]]
then 
    echo "Valid URL"
else
    echo "Invalid URL!"
    exit 1
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BIN_DIR="/opt/magic-mirror"

pip3 install -r $SCRIPT_DIR/requirements.txt

# see https://github.com/elalemanyo/raspberry-pi-kiosk-screen#epiphany-browser
sudo apt update && sudo apt upgrade -y
sudo apt install -y epiphany-browser x11-xserver-utils xautomation unclutter

sudo rm -rf $BIN_DIR

sudo mkdir $BIN_DIR

sudo cp -r $SCRIPT_DIR/* $BIN_DIR

sudo chmod -R 0755 $BIN_DIR

# see https://github.com/elalemanyo/raspberry-pi-kiosk-screen#epiphany-browser
mv $BIN_DIR/autostart /home/$USER/.config/lxsession/LXDE-pi/autostart

sudo sed -i "s|URL|$SERVER_URL|" $BIN_DIR/run.sh