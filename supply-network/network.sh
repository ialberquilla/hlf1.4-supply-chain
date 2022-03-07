#!/bin/bash
source scripts/envVar.sh
source scripts/utils.sh
# Chaincode variable definitions
export DOCKER_SOCK=/var/run/docker.sock
export IMAGE_TAG=latest
export FABRIC_CFG_PATH=${PWD}/config
declare CHANNEL_NAME="mychannel"

# Parse commandline args
## Parse mode
if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
else
  MODE=$1
  shift
fi

# parse a createChannel subcommand if used
if [[ $# -ge 1 ]] ; then
  key="$1"
  if [[ "$key" == "createChannel" ]]; then
      export MODE="createChannel"
      shift
  fi
fi

# parse flags
while [[ $# -ge 1 ]] ; do
    key="$1"
    case $key in
    -h )
        printHelp $MODE
        exit 0
        ;;
    -c )
        CHANNEL_NAME="$2"
        shift
        ;;
    -ca )
        CRYPTO="Certificate Authorities"
        ;;
    -r )
        MAX_RETRY="$2"
        shift
        ;;
    -d )
        CLI_DELAY="$2"
        shift
        ;;
    -s )
        DATABASE="$2"
        shift
        ;;
    -ccl )
        CC_SRC_LANGUAGE="$2"
        shift
        ;;
    -ccn )
        CC_NAME="$2"
        shift
        ;;
    -ccv )
        CC_VERSION="$2"
        shift
        ;;
    -ccs )
        CC_SEQUENCE="$2"
        shift
        ;;
    -ccp )
        CC_SRC_PATH="$2"
        shift
        ;;
    -ccep )
        CC_END_POLICY="$2"
        shift
        ;;
    -cccg )
        CC_COLL_CONFIG="$2"
        shift
        ;;
    -cci )
        CC_INIT_FCN="$2"
        shift
        ;;
    -ccaasdocker )
        CCAAS_DOCKER_RUN="$2"
        shift
        ;;
    -verbose )
        VERBOSE=true
        ;;
    * )
        errorln "Unknown flag: $key"
        printHelp
        exit 1
        ;;
    esac
    shift
done


if [ "$MODE" == "start" ]; then

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
elif [ "$MODE" == "deployCC" ]; then
    infoln "Deploying chaincode"
    #example 
    #./network.sh deployCC -ccn erc1155 -ccp ../token-erc-1155/chaincode-go/ -ccl go
    ./scripts/deployCC.sh $CHANNEL_NAME $CC_NAME $CC_SRC_PATH $CC_SRC_LANGUAGE $CC_VERSION $CC_SEQUENCE $CC_INIT_FCN $CC_END_POLICY $CC_COLL_CONFIG $CLI_DELAY $MAX_RETRY $VERBOSE
elif [ "$MODE" == "stop" ]; then
    ./scripts/stop.sh
elif [ "$MODE" == "install" ]; then
    cd ./chaincode
    npm install
    cd ..
    npm install
fi