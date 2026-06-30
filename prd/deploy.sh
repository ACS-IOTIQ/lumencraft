#!/bin/sh
# Run this script on the server after cloning the repo.
# Usage: cd /opt/lumencraft/prd && sh deploy.sh

set -e

echo "▶  Pulling latest code..."
cd ..
git pull

echo "▶  Building and starting containers..."
cd prd
docker compose up -d --build

echo "▶  Tailing app logs (Ctrl+C to stop watching)..."
docker logs lumencraft-app -f
