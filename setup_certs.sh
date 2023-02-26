#!/bin/bash

if ! [ -x "$(command -v mkcert)" ]; then
  echo 'Error: mkcert is not installed.' >&2
  exit 1
fi

ssl_dir="./nginx/ssl"

mkcert -key-file $ssl_dir/magic-mirror.local.com.key -cert-file $ssl_dir/magic-mirror.local.com.pem magic-mirror.local.com localhost 127.0.0.1 ::1
cp $ssl_dir/magic-mirror.local.com.pem $ssl_dir/magic-mirror.local.com.bundle.pem
echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" >> $ssl_dir/magic-mirror.local.com.bundle.pem

mkcert -key-file $ssl_dir/api.magic-mirror.local.com.key -cert-file $ssl_dir/api.magic-mirror.local.com.pem api.magic-mirror.local.com localhost 127.0.0.1 ::1
cp $ssl_dir/api.magic-mirror.local.com.pem $ssl_dir/api.magic-mirror.local.com.bundle.pem
echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" >> $ssl_dir/api.magic-mirror.local.com.bundle.pem

mkcert -key-file ./middleware/ssl/express.key -cert-file ./middleware/ssl/express.pem api.magic-mirror.local.com middleware localhost 127.0.0.1 ::1

#echo "127.0.0.1 api.magic-mirror.local.com" >> /etc/hosts
#echo "127.0.0.1 magic-mirror.local.com" >> /etc/hosts
# echo "127.0.0.1 api.magic-mirror.local.com" >> /mnt/c/Windows/System32/drivers/etc/hosts
# echo "127.0.0.1 magic-mirror.local.com" >> /mnt/c/Windows/System32/drivers/etc/hosts