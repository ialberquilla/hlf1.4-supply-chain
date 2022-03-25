const express = require('express');

const routerApi = require('./routes');
const router = require('./routes/wallet.router');

const app = express();
const port = 3555;

routerApi(app);

/// Defnie here IPFS fubnctionality
//const { create } = 'ipfs-http-client'
// connect to the default API address http://localhost:5001
//const client = create(new URL('http://127.0.0.1:5002'))

// call Core API methods
//const { cid } = await client.add('Hello world!')




app.get('/', (request, response) => {
  console.log("calling root");
  response.send('My root');
});

app.listen(port, () => {
  console.log(`Application is listening on port: ${port}`);
});
