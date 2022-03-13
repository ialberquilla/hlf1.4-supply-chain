source scripts/utils.sh
infoln "***********************************"
infoln "       Starting network            "
infoln "***********************************"

createDir "organizations"
createDir "organizations/ordererOrganizations/example.com/msp"
copyDir "config/fabric-ca" "organizations"

docker compose -f ./compose/docker-compose-ca.yaml up -d
waitForFileCreated "organizations/fabric-ca/org1/tls-cert.pem"
infoln "Invoking registering and enroll scripts..."
source scripts/register-enroll.sh
infoln "Creating Org1 Identities"
createOrg1
infoln "Creating Org2 Identities"
createOrg2
infoln "Creating Orderer Organization"
createOrderer
infoln "Running Network Infrastructure"
docker compose -f ./compose/docker-compose-test-net.yaml up -d
infoln "Generating CCP files for Org1 and Org2"
./scripts/ccp-generate.sh
infoln "Creating Channel"
./scripts/createChannel.sh $CHANNEL_NAME
infoln "Running Hyperledger explorer"
#This command will rename all keystores present in the peers folder
infoln "Running Hyperledger explorer"
for file in $(ls -R ./organizations/peerOrganizations/ | grep keystore: | cut -d':' -f 1  | sed 's/$//'); do mv $file/* $file/key; done
docker compose -f ./compose/docker-compose-explorer.yaml up -d