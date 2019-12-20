var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const fabricNetwork = require('./fabricNetwork')
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.post('/api/addTuna', async function (req, res) {

  try {
    const contract = await fabricNetwork.connectNetwork('connection-producer.json', 'wallet/wallet-producer');
    let tuna = {
      id: req.body.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      length: req.body.length,
      weight: req.body.weight
    }
    let tx = await contract.submitTransaction('addAsset', JSON.stringify(tuna));
    res.json({
      status: 'OK - Transaction has been submitted',
      txid: tx.toString()
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

});

app.get('/api/getTuna/:id', async function (req, res) {
  try {
    const contract = await fabricNetwork.connectNetwork('connection-retailer.json', 'wallet/wallet-retailer');
    const result = await contract.evaluateTransaction('queryAsset', req.params.id.toString());
    let response = JSON.parse(result.toString());
    res.json({result:response});
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }
})


app.post('/api/setPosition', async function (req, res) {

  try {
    const contract = await fabricNetwork.connectNetwork('connection-deliverer.json', 'wallet/wallet-deliverer');
    let tx = await contract.submitTransaction('setPosition', req.body.id.toString(), req.body.latitude.toString(), req.body.longitude.toString());
    res.json({
      status: 'OK - Transaction has been submitted',
      txid: tx.toString()
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

});


app.get('/api/getHistorySushi/:id', async function (req, res) {
  try {
    const contract = await fabricNetwork.connectNetwork('connection-producer.json', 'wallet/wallet-producer');
    const historySushi = JSON.parse((await contract.evaluateTransaction('getHistory', req.params.id.toString())).toString());
    const actualSushi = JSON.parse((await contract.evaluateTransaction('querySushi', req.params.id.toString())).toString());
    historySushi.unshift(actualSushi);
    const historyTuna = JSON.parse((await contract.evaluateTransaction('getHistory', actualSushi.tunaId.toString())).toString());
    const actualTuna = JSON.parse((await contract.evaluateTransaction('queryTuna', actualSushi.tunaId.toString())).toString());
    historyTuna.unshift(actualTuna);
    res.json({
      historySushi: historySushi,
      historyTuna: historyTuna
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }
})

app.get('/api/getShushi/:id', async function (req, res) {
  try {
    const contract = await fabricNetwork.connectNetwork('connection-retailer.json', 'wallet/wallet-retailer');
    const result = await contract.evaluateTransaction('queryAsset', req.params.id.toString());
    let response = JSON.parse(result.toString());
    res.json(response);
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }
})


app.post('/api/addShushi', async function (req, res) {
  try {
    const contract = await fabricNetwork.connectNetwork('connection-manufacturer.json', 'wallet/wallet-manufacturer');
    let sushi = {
      id: req.body.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      type: req.body.type,
      tunaId: req.body.tunaId
    }
    let tx = await contract.submitTransaction('addAsset', JSON.stringify(sushi));
    res.json({
      status: 'OK - Transaction has been submitted',
      txid: tx.toString()
    });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({
      error: error
    });
  }

})


app.listen(3000, ()=>{
  console.log("***********************************");
  console.log("API server listening at localhost:3000");
  console.log("***********************************");
});