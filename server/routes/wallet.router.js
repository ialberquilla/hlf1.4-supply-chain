const express = require('express');
const faker = require('faker');
const router = express.Router();

router.get('/', (request, response) => {
  const {size} = request.query;
  const limit = size || 100;
  const wallets = [];
  for(let i = 0  ; i < limit; i++){
    wallets.push({
      name: faker.commerce.productName(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl()
    });
  }
  response.json({
    total : limit,
    wallets : wallets
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


router.get('/:id/enroll', (request, response) => {
  var { id } = request.params;
  var {  channel, delay } = request.query;
  if( !channel ){
    channel = 1;
  }
  if( !delay ){
    delay = 0;
  }
  response.send(`enrolling wallet with id ${id} ....${channel} ${delay}`);
});


module.exports = router;
