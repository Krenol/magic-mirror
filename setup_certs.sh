#!/bin/bash

DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [ -x "$(command -v mkcert)" ]; then
  echo "Setup with mkcert"
  bash certs/mkcert_create.sh
else
  echo "Please install mkcert"
fi
