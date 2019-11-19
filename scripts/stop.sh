#!/bin/bash

echo "Stopping containers... "
docker-compose -f docker-compose-cli.yaml down --volumes --remove-orphans
rm -r ./crypto-config
rm -r ./channel-artifacts