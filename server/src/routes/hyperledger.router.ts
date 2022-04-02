import express, { NextFunction } from 'express';
import Boom from 'boom';
import ChaincodeService from '../services/chaincode.service';
var _ = require('underscore');
import validatorHandler from '../middlewares/validator.handler';
import { ConnectionParams } from 'services/hyperledgerParams.interface';
const { getChaincodeEventsSchema } = require( '../schemas/hyperledger.schemas');
class HyperledgerRouter {
  router: express.Router;
  service: ChaincodeService;

  constructor() {
    this.router = express.Router();
    this.service = new ChaincodeService();
    _.bindAll(this.service, Object.getOwnPropertyNames(Object.getPrototypeOf(this.service)));

    this.router.get('/', async (req, res) => {
      const parameters = await this.service.displayInputParameters();
      if(parameters){
        res.json(parameters);
      }
      else{
        res.send('No connection parameters provided.')
      }
    });

    this.router.put('/connect', async(req, res) => {
      const connParams: ConnectionParams = req.body;
      if(connParams){
        var params: ConnectionParams = {
          chaincodeName: 'erc721',
          channelName: 'mychannel',
          idName: 'User1',
          mspId: 'Org1MSP',
          organization: 'org1.example.com',
          peerEndpoint: 'localhost:7051',
          peerName: 'peer0'
        };
      }
      this.service.connect(connParams);
      res.send('Connection Established')
    });

    this.router.get('/events/:block',
      async (request, response, next) => {
        validatorHandler(getChaincodeEventsSchema, request.params.block);
        try{
          const { block}  = request.params;
          const blockInt: bigint = BigInt(block) ?? 0;
          const parameters = await this.service.GetChaincodeEvents(blockInt);
          response.json(parameters);
        }
        catch(error){
          next(error);
        }
    });
  }
}
export default HyperledgerRouter;
