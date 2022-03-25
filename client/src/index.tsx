import React from 'react';
import ReactDOM from 'react-dom';
//const path = require('path');

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Gateway, GatewayOptions } from 'fabric-network';
import { buildCCPOrg1, buildWallet, prettyJSONString } from './utils//AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';
import * as path from 'path';
//var path = require('path');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
console.log(walletPath);
const org1UserId = 'appUser';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
