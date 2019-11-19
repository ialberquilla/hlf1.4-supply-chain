#!/bin/bash

echo "Creating containers... "
docker-compose -f docker-compose-cli.yaml up -d
echo 
echo "Containers started" 
echo 
docker ps

echo
docker exec -it cli ./scripts/channel/createChannel.sh

echo "Joining Manufacturer to channel..."
docker exec -e "CORE_PEER_LOCALMSPID=ManufacturerMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.example.com/users/Admin@manufacturer.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.manufacturer.example.com:7051" -it cli ./scripts/channel/joinPeer.sh
echo "Joining Deliverer to channel..."
docker exec -e "CORE_PEER_LOCALMSPID=DelivererMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/deliverer.example.com/users/Admin@deliverer.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.deliverer.example.com:7051" -it cli ./scripts/channel/joinPeer.sh
echo "Joining Retailer to channel..." 
docker exec -e "CORE_PEER_LOCALMSPID=RetailerMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.example.com/users/Admin@retailer.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.retailer.example.com:7051" -it cli ./scripts/channel/joinPeer.sh


