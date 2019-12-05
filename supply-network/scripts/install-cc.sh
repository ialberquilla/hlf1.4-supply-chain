#!/bin/bash

echo "Installing chaincode for producer..."
docker exec -it cli ./scripts/install-cc/install-peer.sh peer0 producer ProducerMSP 7051 1.0
echo "Installing chaincode for manufacturer..."
docker exec -it cli ./scripts/install-cc/install-peer.sh peer0 manufacturer ManufacturerMSP 9051 1.0
echo "Installing chaincode for deliverer..."
docker exec -it cli ./scripts/install-cc/install-peer.sh peer0 deliverer DelivererMSP 10051 1.0
echo "Installing chaincode for retailer..."
docker exec -it cli ./scripts/install-cc/install-peer.sh peer0 retailer RetailerMSP 11051 1.0
echo "Instanciating the chaincode..."
docker exec -it cli ./scripts/install-cc/instanciate.sh 