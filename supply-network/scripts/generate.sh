#!/bin/bash
# Set environment variable where configtx.yaml and other config file related for hyperleder are located
export FABRIC_CFG_PATH=$(pwd)/supply-network/config
export IMAGE_TAG=latest
export CHANNEL_NAME=mychannel
echo "Generating cryto material for peers..."
[ -d ./supply-network/channel-artifacts ] || mkdir ./supply-network/channel-artifacts

cryptogen generate --config=./supply-network/config/crypto-config.yaml --output="./supply-network/crypto-config"

echo "Generating genesis block..."
configtxgen -profile SupplyOrdererGenesis -channelID $CHANNEL_NAME -outputBlock ./supply-network/channel-artifacts/${CHANNEL_NAME}.block
echo "Creating Channel"
#osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY"
#configtxgen -profile SupplyChannel -outputCreateChannelTx ./supply-network/channel-artifacts/channel.tx -channelID mychannel
configtxgen -profile SupplyChannel -outputCreateChannelTx ./supply-network/channel-artifacts/${}.tx -channelID channel1

CURRENT_DIR=$PWD
cd ./supply-network/base
cp docker-compose-base-template.yaml docker-compose-base.yaml
OPTS="-i"
cd $CURRENT_DIR
cd ./supply-network/crypto-config/peerOrganizations/producer.example.com/ca/
PRIV_KEY=$(ls *_sk)
cd $CURRENT_DIR
cd ./supply-network/base
sed $OPTS "s/CA1_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-base.yaml

cd $CURRENT_DIR
cd ./supply-network/crypto-config/peerOrganizations/manufacturer.example.com/ca/
PRIV_KEY=$(ls *_sk)
cd $CURRENT_DIR
cd ./supply-network/base
sed $OPTS "s/CA2_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-base.yaml


cd $CURRENT_DIR
cd ./supply-network/crypto-config/peerOrganizations/deliverer.example.com/ca/
PRIV_KEY=$(ls *_sk)
cd $CURRENT_DIR
cd ./supply-network/base
sed $OPTS "s/CA3_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-base.yaml


cd $CURRENT_DIR
cd ./supply-network/crypto-config/peerOrganizations/retailer.example.com/ca/
PRIV_KEY=$(ls *_sk)
cd $CURRENT_DIR
cd ./supply-network/base
sed $OPTS "s/CA4_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-base.yaml


cd $CURRENT_DIR
./supply-network/scripts/ccp-generate.sh
