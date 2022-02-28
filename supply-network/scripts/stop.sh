#!/bin/bash
export IMAGE_TAG=latest
echo "***********************************"
echo "       Stopping network            "
echo "***********************************"
docker-compose -f ./supply-network/docker-compose-cli.yaml down --volumes --remove-orphans

[ -d ./supply-network/crypto-config ] && rm -rf ./supply-network/crypto-config
[ -d ./supply-network/channel-artifacts ] && rm -rf ./supply-network/channel-artifacts
[ -f ./supply-network/base/docker-compose-base.yaml ] && rm -rf ./supply-network/base/docker-compose-base.yaml

[ -d ./wallet ] && rm -r ./wallet

docker network prune -f
docker volume prune -f
docker container prune -f

    
echo "***********************************"
echo "       Network stopped!            "
echo "***********************************"ne
