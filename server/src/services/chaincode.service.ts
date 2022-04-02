import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, ProposalOptions, Signer, signers, Network, CloseableAsyncIterable, ChaincodeEvent, GatewayError } from '@hyperledger/fabric-gateway';
import { Gateway, GatewayOptions } from 'fabric-network';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import { HyperledgerParams, ConnectionParams } from './hyperledgerParams.interface'
import { conflict } from 'boom';

class ChaincodeService {
  utf8Decoder: TextDecoder = new TextDecoder();
  network: Network;
  params: HyperledgerParams;

  resolveParams(params: ConnectionParams) : HyperledgerParams{
    const rootPath = path.resolve(__dirname, '..','..', '..', 'supply-network', 'organizations', 'peerOrganizations', params.organization);
    const fullIdName = `${params.idName}@${params.organization}`;
    const fullPeerName = `${params.peerName}.${params.organization}`;
    const cryptoPath = path.resolve(rootPath, 'users', fullIdName, 'msp');
    const hyperledgerParams : HyperledgerParams = {
      rootPath: rootPath,
      keyDirectoryPath : path.resolve(cryptoPath, 'keystore'),
      certPath: path.resolve(cryptoPath, 'signcerts', 'cert.pem'),
      tlsCertPath:  path.resolve(rootPath, 'peers', fullPeerName, 'tls', 'ca.crt'),
      peerEndpoint: params.peerEndpoint,
      chaincodeName: params.chaincodeName,
      mspId: params.mspId,
      channelName: params.channelName,
      peerHostAlias:fullPeerName
    };
    return hyperledgerParams;

  }

  async connect(params: ConnectionParams): Promise<void> {
    this.params = this.resolveParams(params);
    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    console.log("Establishing connection with hyperledger...");
    const client = await this.newGrpcConnection();
    const gateway = connect({
      client,
      identity: await this.newIdentity(this.params.certPath, this.params.mspId),
      signer: await this.newSigner(),
      // Default timeouts for different gRPC calls
      evaluateOptions: () => {
        return { deadline: Date.now() + 5000 }; // 5 seconds
      },
      endorseOptions: () => {
        return { deadline: Date.now() + 15000 }; // 15 seconds
      },
      submitOptions: () => {
        return { deadline: Date.now() + 5000 }; // 5 seconds
      },
      commitStatusOptions: () => {
        return { deadline: Date.now() + 60000 }; // 1 minute
      },
    });
    // Get a network instance representing the channel where the smart contract is deployed.
     this.network = gateway.getNetwork(this.params.channelName);
  }

  async newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(this.params.tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(this.params.peerEndpoint, tlsCredentials, {
      'grpc.ssl_target_name_override': this.params.peerHostAlias,
    });
  }

  async newIdentity(certificatePath: string, managedServieProviderId: string): Promise<Identity> {
    const credentials = await fs.readFile(certificatePath);
    return { mspId: managedServieProviderId, credentials: credentials };
  }

  async newSigner(): Promise<Signer> {
    const files = await fs.readdir(this.params.keyDirectoryPath);
    const keyPath = path.resolve(this.params.keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
  }

  /**
   * Evaluate a transaction to query ledger state.
   */
  async evaluate(contract: Contract, methodName: string): Promise<void> {
    console.log(`\n--> Evaluate Transaction: ${methodName}}, function returns all the current assets on the ledger`);
    const resultBytes = await contract.evaluateTransaction(methodName);
    const resultJson = this.utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
  }

  /**
   * Submit a transaction synchronously, blocking until it has been committed to the ledger.
   */
  public async submitTransaction(contract: Contract, methodName: string, args: string[]): Promise<bigint> {
    console.log(`\n--> Submit Transaction: ${methodName}, with arguments ${args}`);
    const options: ProposalOptions = { arguments: args };
    try {
      const result = await contract.submitAsync(methodName, options);
      const status = await result.getStatus();
      if (!status.successful) {
        throw new Error(`Failed to commit transaction ${status.transactionId} with status code ${status.code}`);
      }
      return status.blockNumber;
    }
    catch (error) {
      console.log('*** An error occurred while trying to submit tranasction: \n', error);
      throw error;
    }
  }



  /**
   * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
   */
  envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }


  async startEventListening(network: Network): Promise<CloseableAsyncIterable<ChaincodeEvent>> {
    console.log('\n*** Start chaincode event listening');
    const events = await network.getChaincodeEvents(this.params.chaincodeName);
    void this.readEvents(events); // Don't await - run asynchronously
    return events;
  }

  async readEvents(events: CloseableAsyncIterable<ChaincodeEvent>): Promise<void> {
    try {
      for await (const event of events) {
        const payload = this.parseJson(event.payload);
        console.log(`\n<-- Chaincode event received: ${event.eventName} -`, payload);
      }
    } catch (error: unknown) {
      // Ignore the read error when events.close() is called explicitly
      if (!(error instanceof GatewayError) || error.code !== grpc.status.CANCELLED) {
        throw error;
      }
    }
  }

  parseJson(jsonBytes: Uint8Array): unknown {
    const json = this.utf8Decoder.decode(jsonBytes);
    return JSON.parse(json);
  }

  async GetChaincodeEvents(startBlock: bigint): Promise<unknown[]> {
    console.log('Getting chaincode events...');
    const events = await this.network.getChaincodeEvents(this.params.chaincodeName, {
      startBlock,
    });
    let retVal:unknown[] = [];
    try {
      for await (const event of events) {
        const payload = this.parseJson(event.payload);
        retVal.push(payload);
      }
    } finally {
      events.close();
    }
    console.log('done');
    return retVal;
  }

  /**
   * displayInputParameters() will print the global scope parameters used by the main driver routine.
   */
  async displayInputParameters(): Promise<HyperledgerParams> {
    return this.params;
  }

}

export default ChaincodeService;

