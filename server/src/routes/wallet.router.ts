import express from 'express';
var _ = require('underscore');
import walletHandler from '../handlers/wallet.handler';
class WalletRouter {
  router: express.Router;
  wh: walletHandler;
  constructor() {
    this.router = express.Router();
    this.wh = new walletHandler();
    _.bindAll(this.wh, Object.getOwnPropertyNames(Object.getPrototypeOf(this.wh)));

    this.router.get('/', this.wh.getRootHandler);

    this.router.get('/:id', this.wh.getByIdHandler);

    this.router.get('/:id/enroll', this.wh.getEnrollHandler);

    this.router.post("/create", this.wh.postCreateHandler);

    this.router.patch("/:id", this.wh.postCreateHandler);

    this.router.delete("/:id", this.wh.deleteWalletHandler);
  }
}
export default WalletRouter;
