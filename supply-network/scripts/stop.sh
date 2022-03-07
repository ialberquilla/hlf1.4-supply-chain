#!/bin/bash
source scripts/utils.sh
infoln "***********************************"
infoln "       Stopping network            "
infoln "***********************************"
infoln "Removing docker containers..."
docker compose -f ./compose/docker-compose-ca.yaml -f ./compose/docker-compose-test-net.yaml down --remove-orphans
docker network prune -f
docker volume prune -f
docker container prune -f

infoln "Removing Dirs...."
removeDir "organizations"
removeDir "channel-artifacts"
removeDir "wallet"
removeDir "chaincode/go/chaincode-go/vendor"
removeDir "chaincode/go/pkg"
    
successln "***********************************"
successln "       Network stopped!            "
successln "***********************************"
