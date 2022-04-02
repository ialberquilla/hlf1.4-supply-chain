import express from 'express';
const cors = require('cors');
import * as dotenv from 'dotenv';
import * as ip from 'ip';
import routerApi from './routes/routerApi';
const app = express();
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

dotenv.config();
if (!process.env.PORT) {
  process.exit(1);
}
const port = process.env.PORT;

const whitelist =
  [`http://localhost:${port}}`, //Server endpoint
    'http://localhost:17054', //ca_org1
    'http://localhost:18054', //ca_org2
    'http://localhost:19054', //ca_orderer
    'http://localhost:7051', //peer0.org1.example.com
    'http://localhost:7050', //orderer.example.com
    'http://localhost:9051', //peer0.org2.example.com
    'http://localhost:7051', //ca_orderer
    'http://localhost:9094', //IPFS Cluster
  ];
const rootApi = '/api/v1';
const options = {
  origin: (origin: any, callback: any) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  }
}
app.use(cors(options));

function loggerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
  console.log(`${request.method} ${request.path}`);
  next();
}
app.use(loggerMiddleware);
app.use(express.json());

app.get('/', (request: express.Request, response: express.Response) => {
  console.log("calling root");
  response.send('Hyperledger NFT Backend');
});


routerApi(app,rootApi);


app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  const ip_address: string = ip.address();
  console.log(`Application is listening on port: http://${ip_address}:${port}${rootApi}`);
});
