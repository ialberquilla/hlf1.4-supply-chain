#!/bin/bash
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
CORE_PEER_LOCALMSPID=ProducerMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.example.com/peers/peer0.producer.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.example.com/users/Admin@producer.example.com/msp
CORE_PEER_ADDRESS=peer0.producer.example.com:7051
CHANNEL_NAME=mychannel
CORE_PEER_TLS_ENABLED=true
peer chaincode install -l node -n supcc -v 1.0 -p /opt/gopath/src/github.com/chaincode >&log.txt
cat log.txt