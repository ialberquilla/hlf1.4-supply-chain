#!/bin/bash

echo "Generating cryto material for peers..."
[ -d channel-artifacts ] || mkdir channel-artifacts

../bin/cryptogen generate --config=./crypto-config.yaml

[ -d crypto-config ] || mkdir crypto-config

echo "Generating channel artifacts and genesis block..."
../bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
../bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mychannel
