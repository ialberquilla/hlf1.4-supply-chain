import { Wallet, Wallets } from './wallet.interface'
import { Guid } from "guid-typescript";
import * as faker from 'faker';

class WalletService {
  wallets: Wallets;
  n_wallets: number = 500;
  constructor() {
    this.wallets = [];
    this.generate();
  }

  generate(): void {
    this.wallets = new Array<Wallet>();
    for (let i = 0; i < this.n_wallets; i++) {
      let wallet_obj: Wallet = {
        public_key: faker.datatype.uuid(),
        private_key: faker.datatype.uuid(),
        id: i,
        name: faker.commerce.name,
        address: faker.commerce.address,
        url: faker.url
      };
      this.wallets.push(wallet_obj);
    }
  }

  get(limit: number): Wallets {
    if (limit) {
      return this.wallets.slice(0,limit);
    }
    return this.wallets;
  }

  getById(id: number): Wallet {
    return this.wallets[id];
  }

  find() {

  }
  search() {

  }
  delete() {

  }

}

export default WalletService;
