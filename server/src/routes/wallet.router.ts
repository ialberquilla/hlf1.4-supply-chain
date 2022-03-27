import express from 'express';
import * as faker from 'faker';
import {WalletQuery, WalletParams} from './query.interface';
import WalletService from '../services/wallet.service';
import {Wallet, Wallets} from '../services/wallet.interface'
import internal from 'stream';

const router = express.Router();
let ws = new WalletService();

router.get('/', (request, response) => {
  const {size} = request.query;
  const limit = size || 100;
  response.status(200).json({
    total : limit,
    wallets : ws.generate()
  });
});

router.get('/filter', (request, response) => {
  response.send("filter");
});
router.get('/:id', (request, response) => {
  const { id } = request.params;
  response.json(
      {
        id,
        name: "MyWallet",
        channel: "Channel1",
        orgs:[
        "org1",
        "org2"
        ]
      }
  );
});

function getHandler(request: express.Request<WalletParams,{},{},WalletQuery>, response: express.Response){
    const id = request.params.id;
    const {query} = request;
    query.channel
    if( !query.channel ){
      query.channel = 1;
    }
    if( !query.delay){
      query.delay = 0;
    }
    response.send(`enrolling wallet with id ${id} ....${query.channel} ${query.delay}`);
}

router.get('/:id/enroll',getHandler);


router.post("/create", (request, response) => {
   const body = request.body;
   console.log(body);
   console.log(request.ip);
   response.json({
     message : "created",
     data: body
   });
});

router.patch("/:id", (request, response) => {
  const body = request.body;
  console.log(body);
  response.json({
    message: "updated",
    data:body
  });
});


router.delete("/:id", (request, response) => {
  const body = request.body;
  console.log(body);
  response.json({
    message: "deleted",
  });
});

export default router;
