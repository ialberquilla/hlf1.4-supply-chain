import express from 'express';
import WalletRouter from './wallet.router';

function routerApi(app: express.Express){
  const router = express.Router();
  const walletRouter = new WalletRouter();
  app.use(express.json());
  app.use('/api/v1', router);
  router.use('/wallet', walletRouter.router);
}

export default routerApi;
