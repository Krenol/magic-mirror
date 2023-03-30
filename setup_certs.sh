#!/bin/bash

if ! [ -x "$(command -v mkcert)" ]; then
  echo 'Error: mkcert is not installed.' >&2
  exit 1
fi

domain="local.com"

ssl_dir="./nginx/ssl"
hostname="magic-mirror.$domain"
addtional_hostnames="localhost 127.0.0.1 ::1"
hostname_grafana="grafana.$domain"

mkcert -key-file $ssl_dir/$hostname.key -cert-file $ssl_dir/$hostname.pem $hostname $addtional_hostnames
cp $ssl_dir/$hostname.pem $ssl_dir/$hostname.bundle.pem
echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" >> $ssl_dir/$hostname.bundle.pem

mkcert -key-file ./middleware/ssl/express.key -cert-file ./middleware/ssl/express.pem $hostname middleware $addtional_hostnames

mkcert -key-file ./grafana/ssl/grafana.key -cert-file ./grafana/ssl/grafana.pem $hostname_grafana grafana $addtional_hostnames

echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" > ./grafana/rootCa.pem

echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" > ./middleware/rootCa.pem

# echo "127.0.0.1 $hostname" >> /etc/hosts
# echo "127.0.0.1 $hostname" >> /mnt/c/Windows/System32/drivers/etc/hosts