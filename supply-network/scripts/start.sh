#!/bin/bash
export IMAGE_TAG=1.4.3

echo "Creating containers... "

# TODO This approach is hacky; instead, identify where hyperledger/fabric-ccenv is pulled and update the tag to 1.4.3
docker pull hyperledger/fabric-ccenv:1.4.3
docker tag hyperledger/fabric-ccenv:1.4.3 hyperledger/fabric-ccenv:latest

docker-compose -f ./supply-network/docker-compose-cli.yaml up -d
echo 
echo "Containers started" 
echo 
docker ps

docker exec -it cli ./scripts/channel/createChannel.sh

echo "Joining Deliverer to channel..."
docker exec -it cli ./scripts/channel/join-peer.sh peer0 deliverer DelivererMSP 10051 1.0
echo "Joining Manufacturer to channel..."
docker exec -it cli ./scripts/channel/join-peer.sh peer0 manufacturer ManufacturerMSP 9051 1.0
echo "Joining Retailer to channel..." 
docker exec -it cli ./scripts/channel/join-peer.sh peer0 retailer RetailerMSP 11051 1.0
