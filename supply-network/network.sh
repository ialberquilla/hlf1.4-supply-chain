#!/bin/bash
source scripts/envVar.sh
source scripts/utils.sh
source scripts/ccutils.sh
# Chaincode variable definitions
export DOCKER_SOCK=/var/run/docker.sock
export IMAGE_TAG=latest
export FABRIC_CFG_PATH=${PWD}/config

declare CHANNEL_NAME="mychannel"
declare CC_NAME="basic"
declare CC_SRC_PATH=../chaincode/go/chaincode-go
declare CC_RUNTIME_LANGUAGE="go"
declare CC_SRC_LANGUAGE="go"
declare CC_VERSION="1.0"
declare CC_SEQUENCE="1"
declare CC_INIT_FCN="NA"
declare CC_END_POLICY="NA"
declare CC_COLL_CONFIG="NA"
declare CLI_DELAY="3"
declare MAX_RETRY=5
declare VERBOSE=true

if [ "$1" == "start" ]; then

    createDir "organizations"
    createDir "organizations/ordererOrganizations/example.com/msp"
    copyDir "config/fabric-ca" "organizations"

    docker compose -f ./compose/docker-compose-ca.yaml up -d
    waitForFileCreated "organizations/fabric-ca/org1/tls-cert.pem"
    infoln "Invoking registering and enroll scripts..."
    source scripts/register-enroll.sh
    infoln "Creating Org1 Identities"
    createOrg1
    infoln "Creating Org2 Identities"
    createOrg2
    infoln "Creating Orderer Organization"
    createOrderer
    infoln "Running Network Infrastructure"
    docker compose -f ./compose/docker-compose-test-net.yaml up -d
    infoln "Generating CCP files for Org1 and Org2"
    ./scripts/ccp-generate.sh
    infoln "Creating Channel"
    ./scripts/createChannel.sh $CHANNEL_NAME
    infoln "Deploying chaincode"
    deploy
elif [ "$1" == "stop" ]; then
    ./scripts/stop.sh
elif [ "$1" == "install" ]; then
    cd ./chaincode
    npm install
    cd ..
    npm install
fi