#!/bin/bash
export IMAGE_TAG=latest

echo "Creating containers... "
docker-compose -f ./supply-network/docker-compose-cli.yaml up -d
echo 
echo "Containers started" 
echo 
docker ps

echo $ls 
docker exec -it cli ./scripts/channel/createChannel.sh

echo "Joining Manufacturer to channel..."
docker exec -e "CORE_PEER_LOCALMSPID=ManufacturerMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.example.com/users/Admin@manufacturer.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.manufacturer.example.com:9051" -it cli ./scripts/channel/joinPeer.sh
echo "Joining Deliverer to channel..."
docker exec -e "CORE_PEER_LOCALMSPID=DelivererMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/deliverer.example.com/users/Admin@deliverer.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.deliverer.example.com:10051" -it cli ./scripts/channel/joinPeer.sh
echo "Joining Retailer to channel..." 
docker exec -e "CORE_PEER_LOCALMSPID=RetailerMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.example.com/users/Admin@retailer.example.com/msp" -e "CORE_PEER_ADDRESS=peer0.retailer.example.com:11051" -it cli ./scripts/channel/joinPeer.sh

