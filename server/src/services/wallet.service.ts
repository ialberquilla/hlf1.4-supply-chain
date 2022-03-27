 import { Wallet, Wallets } from './wallet.interface'
 import { Guid } from "guid-typescript";
 import * as faker from 'faker';

class WalletService {
  wallets: Wallets;
  n_wallets: number = 200;
  constructor() {
    this.wallets = [];
  }
  generate() {
    for (let i = 0; i < this.n_wallets; i++) {
      let wallet_obj: Wallet = {
        public_key: faker.data.any.create(),
        private_key: faker.data.any.create(),
        id: i,
        name: faker.commerce.productName(),
        address: Guid.create(),
        url: faker.url
      };
      this.wallets.push(wallet_obj);
    }
  }

  find() {

  }
  search() {

  }
  delete() {

  }

}

export default WalletService;
