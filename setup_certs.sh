#!/bin/bash

if ! [ -x "$(command -v mkcert)" ]; then
  echo 'Error: mkcert is not installed.' >&2
  exit 1
fi

ssl_dir="./nginx/ssl"
hostname="magic-mirror.local.com"
addtional_hostnames="localhost 127.0.0.1 ::1"

mkcert -key-file $ssl_dir/$hostname.key -cert-file $ssl_dir/$hostname.pem $hostname $addtional_hostnames
cp $ssl_dir/$hostname.pem $ssl_dir/$hostname.bundle.pem
echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" >> $ssl_dir/$hostname.bundle.pem

mkcert -key-file ./middleware/ssl/express.key -cert-file ./middleware/ssl/express.pem $hostname middleware $addtional_hostnames

# echo "127.0.0.1 $hostname" >> /etc/hosts
# echo "127.0.0.1 $hostname" >> /mnt/c/Windows/System32/drivers/etc/hosts