#!/bin/bash
source scripts/envVar.sh
source scripts/utils.sh
source scripts/ccutils.sh
# Chaincode variable definitions
export DOCKER_SOCK=/host/var/run/docker.sock
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
    [ ! -d organizations ] && mkdir organizations
    [ ! -d organizations/fabric-ca ] && cp -r config/fabric-ca organizations
    [ ! -d organizations/ordererOrganizations/example.com/msp ] && mkdir -p organizations/ordererOrganizations/example.com/msp

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

elif [ "$1" == "starts" ]; then
    echo "***********************************"
    echo "       Generating artifacts        "
    echo "***********************************"
    ./scripts/generate.sh
    echo "***********************************"
    echo "       Starting network            "
    echo "***********************************"
    ./scripts/start.sh
    echo "***********************************"
    echo "       Installing chaincodes       "
    echo "***********************************"
    ./scripts/install-cc.sh
    echo "***********************************"
    echo "       Registering users           "
    echo "***********************************"
    ./scripts/register-users.sh
elif [ "$1" == "stop" ]; then
    ./scripts/stop.sh
elif [ "$1" == "install" ]; then
    cd ./chaincode
    npm install
    cd ..
    npm install
fi