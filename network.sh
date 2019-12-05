#!/bin/bash
if [ "$1" == "start" ]; then
    echo "***********************************"
    echo "       Generating artifacts        "
    echo "***********************************"
    ./supply-network/scripts/generate.sh
    echo "***********************************"
    echo "       Starting network            "
    echo "***********************************"
    ./supply-network/scripts/start.sh
    echo "***********************************"
    echo "       Installing chaincodes       "
    echo "***********************************"
    ./supply-network/scripts/install-cc.sh
    echo "***********************************"
    echo "       Registering users           "
    echo "***********************************"
    ./supply-network/scripts/register-users.sh
elif [ "$1" == "stop" ]; then
    ./supply-network/scripts/stop.sh
elif [ "$1" == "install" ]; then
    cd ./chaincode
    npm install
    cd ..
    npm install
fi