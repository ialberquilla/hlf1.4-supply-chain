#!/bin/bash

echo "Installing chaincode for producer..."
docker exec -it cli ./scripts/install-cc/install-producer.sh "1.0"
echo "Installing chaincode for manufacturer..."
docker exec -it cli ./scripts/install-cc/install-manufacturer.sh "1.0"
echo "Installing chaincode for deliverer..."
docker exec -it cli ./scripts/install-cc/install-deliverer.sh "1.0" 
echo "Installing chaincode for retailer..."
docker exec -it cli ./scripts/install-cc/install-retailer.sh "1.0"
echo "Instanciating the chaincode..."
docker exec -it cli ./scripts/install-cc/instanciate.sh "1.0"