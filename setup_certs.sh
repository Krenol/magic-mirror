#!/bin/bash

if ! [ -x "$(command -v mkcert)" ]; then
  echo 'Error: mkcert is not installed.' >&2
  exit 1
fi

middleware_ssl_dir="./middleware/nginx/ssl"
frontend_ssl_dir="./frontend/nginx/ssl"

mkcert -key-file $frontend_ssl_dir/magic-mirror.local.com.key -cert-file $frontend_ssl_dir/magic-mirror.local.com.pem magic-mirror.local.com localhost 127.0.0.1 ::1
cp $frontend_ssl_dir/magic-mirror.local.com.pem $frontend_ssl_dir/bundle.pem
echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" >> $frontend_ssl_dir/bundle.pem

mkcert -key-file $middleware_ssl_dir/api.magic-mirror.local.com.key -cert-file $middleware_ssl_dir/api.magic-mirror.local.com.pem api.magic-mirror.local.com localhost 127.0.0.1 ::1
cp $middleware_ssl_dir/api.magic-mirror.local.com.pem $middleware_ssl_dir/bundle.pem
echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" >> $middleware_ssl_dir/bundle.pem

#echo "127.0.0.1 api.magic-mirror.local.com" >> /etc/hosts