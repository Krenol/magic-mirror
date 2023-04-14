#!/bin/bash

DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

docker_setup() {
  docker build -f ./certs/Dockerfile -t mkcert ./certs
  docker run -v $DIR:/root/share mkcert \
    /bin/bash -c "mkcert -install && bash certs/mkcert_create.sh"
}

if [ -x "$(command -v mkcert)" ]; then
  echo "Setup with mkcert"
  bash certs/mkcert_create.sh
else
  echo "Setup with docker"
  docker_setup
fi
