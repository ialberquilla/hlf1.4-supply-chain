import express from 'express';
import { WalletQuery, WalletParams } from './query.interface';
import WalletService from '../services/wallet.service';
import { Wallets, Wallet } from '../services/wallet.interface';
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';

class WalletHandler {
  ws: WalletService = new WalletService();

  getRootHandler(request: express.Request, response: express.Response) {
    console.log(this.ws);
    const { size } = request.query;
    let limit: number = 100;
    if (size) {
      limit = Number(size);
    }
    response.status(200).json({
      total: limit,
      wallets: this.ws.get(limit)
    });
  }

  getByIdHandler(request: express.Request, response: express.Response) {
    const { id } = request.params;
    if (!id) {
      var errorMsg = `Wallet with id ${id} not found`;
      console.log(ReasonPhrases.NOT_FOUND);
      response.status(StatusCodes.NOT_FOUND).send(errorMsg);
    }
    const id_int = Number(id)
    let wallet: Wallet = this.ws.getById(id_int);
    response.status(StatusCodes.OK).json(wallet);
  }

  getEnrollHandler(request: express.Request<WalletParams, {}, {}, WalletQuery>, response: express.Response) {
    const id = request.params.id;
    const { query } = request;
    query.channel
    if (!query.channel) {
      query.channel = 1;
    }
    if (!query.delay) {
      query.delay = 0;
    }
    response.send(`enrolling wallet with id ${id} ....${query.channel} ${query.delay}`);
  }

  postCreateHandler(request: express.Request, response: express.Response) {
    const body = request.body;
    console.log(body);
    response.status(StatusCodes.CREATED).json({
      message: "created",
      data: body
    });
  }

  patchUpdateHanlder(request: express.Request, response: express.Response){
    const body = request.body;
    console.log(body);
    response.status(StatusCodes.CREATED).json({
      message: "updated",
      data:body
    });
  }

   deleteWalletHandler(request: express.Request, response: express.Response){
    const body = request.body;
    console.log(body);
    response.status(StatusCodes.OK).json({
      message: "deleted",
    });
   }

}
export default WalletHandler;
