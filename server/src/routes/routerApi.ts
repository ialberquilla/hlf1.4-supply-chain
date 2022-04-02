import express from 'express';
import HyperledgerRouter from './hyperledger.router';

function routerApi(app: express.Express, rootApi: string){
  const router = express.Router();
  const hyperledgerRouter = new HyperledgerRouter();
  app.use(express.json());
  app.use(rootApi, router);
  router.use('/hyp', hyperledgerRouter.router);
}

export default routerApi;
