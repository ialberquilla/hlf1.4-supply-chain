const express = require('express');
const walletsRouter = require('./wallet.router');

function routerApi(app){
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/wallet', walletsRouter)
}

module.exports = routerApi;
