import express from 'express';
import walletsRouter from './wallet.router';

function routerApi(app: express.Express){
  const router = express.Router();
  app.use(express.json());
  app.use('/api/v1', router);
  router.use('/wallet', walletsRouter);
}

export default routerApi;
