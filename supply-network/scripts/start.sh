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
docker exec -it cli ./scripts/channel/join-deliverer.sh
echo "Joining Manufacturer to channel..."
docker exec -it cli ./scripts/channel/join-manufacturer.sh
echo "Joining Retailer to channel..." 
docker exec -it cli ./scripts/channel/join-retailer.sh
