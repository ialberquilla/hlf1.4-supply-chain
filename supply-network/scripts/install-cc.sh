#!/bin/bash

echo "Installing chaincode for producer..."
docker exec -it cli ./scripts/install-cc/install-producer.sh
echo "Installing chaincode for manufacturer..."
docker exec -it cli ./scripts/install-cc/install-manufacturer.sh
echo "Installing chaincode for deliverer..."
docker exec -it cli ./scripts/install-cc/install-deliverer.sh
echo "Installing chaincode for retailer..."
docker exec -it cli ./scripts/install-cc/install-retailer.sh
echo "Instanciating the chaincode..."
docker exec -it cli ./scripts/install-cc/instanciate.sh