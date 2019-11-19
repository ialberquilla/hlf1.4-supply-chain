#!/bin/bash

echo "Generating cryto material for peers..."
[ -d ./supply-network/channel-artifacts ] || mkdir ./supply-network/channel-artifacts

../bin/cryptogen generate --config=./supply-network/crypto-config.yaml --output="./supply-network/crypto-config"

[ -d ./supply-network/crypto-config ] || mkdir ./supply-network/crypto-config

echo "Generating channel artifacts and genesis block..."
../bin/configtxgen -configPath ./supply-network -profile TwoOrgsOrdererGenesis -outputBlock ./supply-network/channel-artifacts/genesis.block
../bin/configtxgen -configPath ./supply-network -profile TwoOrgsChannel -outputCreateChannelTx ./supply-network/channel-artifacts/channel.tx -channelID mychannel
