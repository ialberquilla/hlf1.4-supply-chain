#!/bin/bash
echo "***********************************"
echo "       Stopping network            "
echo "***********************************"
docker compose -f ./compose/docker-compose-ca.yaml -f ./compose/docker-compose-test-net.yaml down --remove-orphans
[ -d organizations ]  && rm -rf ./organizations
[ -d ./crypto-config ] && rm -rf ./crypto-config
[ -d ./channel-artifacts ] && rm -rf ./channel-artifacts
[ -d ./wallet ] && rm -r ./wallet

docker network prune -f
docker volume prune -f
docker container prune -f
    
echo "***********************************"
echo "       Network stopped!            "
echo "***********************************"ne
