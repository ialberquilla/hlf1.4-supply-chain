// Setting for Hyperledger Fabric
const {  FileSystemWallet,  Gateway} = require('fabric-network');
const IDENTITY = 'user1';
const CHANNEL = 'mychannel';
const CONTRACT = 'supcc';
const path = require('path');


async function connectNetwork(conn, walletOrg) {
  const walletPath = path.join(process.cwd(), walletOrg);
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);
  const ccpPath = path.resolve(__dirname,'..','..','connections', conn);
  // Check to see if we've already enrolled the user.
  const userExists = await wallet.exists(IDENTITY);
  if (!userExists) {
    console.log('An identity for the user "user1" does not exist in the wallet');
    console.log('Run the registerUser.js application before retrying');
    return;
  }
  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccpPath, {
    wallet,
    identity: IDENTITY,
    discovery: {
      enabled: true,
      asLocalhost: true
    }
  });
  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork(CHANNEL);
  // Get the contract from the network.
  const contract = network.getContract(CONTRACT);
  return contract;
}

module.exports = {connectNetwork}