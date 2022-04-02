interface HyperledgerParams{
  channelName: string,
  chaincodeName: string,
  mspId: string,
  // Path to crypto materials.
  rootPath: string,
  // Path to user private key directory.
  keyDirectoryPath: string,
  // Path to user certificate.
  certPath: string,
  // Path to peer tls certificate.
  tlsCertPath: string,
  // Gateway peer endpoint.
  peerEndpoint: string,
  // Gateway peer SSL host name override.
  peerHostAlias: string
}


interface ConnectionParams{
  channelName: string,
  chaincodeName: string,
  mspId: string,
  organization:string,
  //Identity user name
  idName: string,
  // Peer name
  peerName:string
  //Peer endpoint from organization
  peerEndpoint:string
}

export {ConnectionParams, HyperledgerParams };
