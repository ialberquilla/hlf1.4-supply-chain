#!/bin/bash
export IMAGE_TAG=latest

echo "Creating containers... "
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
