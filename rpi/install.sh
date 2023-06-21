#!/bin/bash


URL_REGEX='(https?)://[-[:alnum:]\+&@#/%?=~_|!:,.;]*[-[:alnum:]\+&@#/%=~_|]'
USERNAME=$USER
GROUP_ID=$(id -g)
GROUP_NAME=$(getent group $group_id | cut -d: -f1)
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BIN_DIR="/opt/magic-mirror"

#TODO get current username; check that not run as root and get URL and replace it in run.sh

if [[ "$EUID" = 0 ]]; then
    echo "Script must not be run as root"
    exit 1
fi

echo "Enter server URL: "  
read SERVER_URL


if [[ $SERVER_URL =~ $URL_REGEX ]]
then 
    echo "Valid URL"
else
    echo "Invalid URL!"
    exit 1
fi

sudo apt update && sudo apt upgrade -y

sudo apt install -y python3 python3-pip

sudo rm -rf $BIN_DIR

sudo mkdir $BIN_DIR

sudo cp -r $SCRIPT_DIR/* $BIN_DIR

sudo chown -R $USERNAME:$GROUP_NAME $BIN_DIR

if [[ -f "/etc/os-release" ]]; then
  source /etc/os-release
  if [[ "$ID" == "ubuntu" ]]; then
    echo "Current OS is Ubuntu."
    sudo apt install -y firefox python3-lgpio
    mv ubuntu/* $BIN_DIR
    pip3 install -r $BIN_DIR/requirements.txt
    mkdir ~/.config/autostart
    cp $BIN_DIR/magicmirror.desktop ~/.config/autostart/
    chmod +x ~/.config/autostart/magicmirror.desktop
    sudo sed -i '/^\s*#*\s*WaylandEnable/ s/.*/WaylandEnable=false/' /etc/gdm3/custom.conf
    sudo systemctl restart gdm3
  elif [[ "$ID" == "raspbian" ]]; then
    echo "Current OS is Raspbian."
    # see https://github.com/elalemanyo/raspberry-pi-kiosk-screen#epiphany-browser
    sudo apt install -y firefox-esr x11-xserver-utils unclutter
    mv raspbian/* $BIN_DIR
    pip3 install -r $BIN_DIR/requirements.txt
    # see https://github.com/elalemanyo/raspberry-pi-kiosk-screen#epiphany-browser
    mkdir -p /home/$USER/.config/lxsession/LXDE-pi
    cp  $BIN_DIR/autostart /home/$USER/.config/lxsession/LXDE-pi/autostart
  else
    echo "Current OS is neither Ubuntu nor Raspbian."
    exit 1
  fi
else
  echo "Unable to determine the current OS."
  exit 1
fi
sudo chmod +x $BIN_DIR/run.sh
sudo sed -i "s|URL|$SERVER_URL|" $BIN_DIR/run.sh