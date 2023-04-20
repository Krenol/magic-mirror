#!/bin/bash
DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# parent dir of that dir
PARENT_DIRECTORY="${DIR%/*}"
domain="fritz.box"
ssl_dir="$PARENT_DIRECTORY/nginx/ssl"
host=$(echo $(hostname) | awk '{print tolower($0)}')
hostname="$host.$domain"
addtional_hostnames="localhost 127.0.0.1 ::1"
hostname_grafana="$host.$domain"

mkcert -key-file $ssl_dir/$hostname.key -cert-file $ssl_dir/$hostname.pem $hostname $addtional_hostnames
cp $ssl_dir/$hostname.pem $ssl_dir/$hostname.bundle.pem
echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" >> $ssl_dir/$hostname.bundle.pem

mkcert -key-file $PARENT_DIRECTORY/backend/ssl/express.key -cert-file $PARENT_DIRECTORY/backend/ssl/express.pem $hostname backend $addtional_hostnames

mkcert -key-file $PARENT_DIRECTORY/grafana/ssl/grafana.key -cert-file $PARENT_DIRECTORY/grafana/ssl/grafana.pem $hostname_grafana grafana $addtional_hostnames

echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" > $PARENT_DIRECTORY/grafana/rootCa.pem

echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" > $PARENT_DIRECTORY/backend/rootCa.pem

echo "$(cat $(mkcert -CAROOT)/rootCA.pem)" > $PARENT_DIRECTORY/certs/rootCa.pem

echo "REACT_APP_API_BACKEND_HOST=$hostname" > $PARENT_DIRECTORY/docker-compose/host.env
echo "FRONTEND_URL=https://$hostname" >> $PARENT_DIRECTORY/docker-compose/host.env
echo "PROXY_SERVER_HOSTNAME=$hostname" >> $PARENT_DIRECTORY/docker-compose/host.env