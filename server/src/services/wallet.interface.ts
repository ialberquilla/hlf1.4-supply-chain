import { Guid } from "guid-typescript";
interface Wallet{
  id: number,
  name:string,
  address: Guid,
  public_key:string,
  private_key:string
  url:string;
}

interface Wallets extends Array<Wallet>{};
export { Wallet, Wallets};
