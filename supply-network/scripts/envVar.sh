#!/bin/bash
source scripts/utils.sh
# Environment variable set to fix a docker compose project name
export FABRIC_CFG_PATH=${PWD}/config
export CHANNEL_NAME="mychannel"
# docker compose variables:
export COMPOSE_PROJECT_NAME="nft"
export COMPOSE_NETWORK_NAME="fabric_nft"
export DOCKER_SOCK=/var/run/docker.sock
export IMAGE_TAG=latest

# Chaincode variable definitions
export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key
export PEER0_ORG1_CA=${PWD}/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
export PEER0_ORG2_CA=${PWD}/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
export PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.example.com/tlsca/tlsca.org3.example.com-cert.pem

#Hyperledger explorer environment variables (Used in docker compose file docker-compose-explorer.yaml)
export EXPLORER_CONFIG_FILE_PATH=${PWD}/config/explorer/config.json
export EXPLORER_PROFILE_DIR_PATH=${PWD}/config/explorer/connection-profile
export FABRIC_CRYPTO_PATH=${PWD}/organizations