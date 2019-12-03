#!/bin/bash

echo "***********************************"
echo "       Stopping network            "
echo "***********************************"
docker-compose -f ./supply-network/docker-compose-cli.yaml down --volumes --remove-orphans
rm -r ./supply-network/crypto-config
rm -r ./supply-network/channel-artifacts
rm -r ./supply-network/base/docker-compose-base.yaml
rm -r ./wallet