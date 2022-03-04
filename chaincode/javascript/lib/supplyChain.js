'use strict';

const { Contract } = require('fabric-contract-api');

class SupplyChain extends Contract {


  async addAsset(ctx, asset) {
    console.info('============= START : Add asset ===========');
    await ctx.stub.putState(JSON.parse(asset).id.toString(), Buffer.from(asset));
    console.info('============= END : Add asset ===========');
    return ctx.stub.getTxID()
  }

  async queryAsset(ctx, assetId) {
    console.info('============= START : Query asset ===========');
    const assetAsBytes = await ctx.stub.getState(assetId); 
    if (!assetAsBytes || assetAsBytes.length === 0) {
      throw new Error(`${assetId} does not exist`);
    }
    console.log(assetAsBytes.toString());
    console.info('============= END : Query asset ===========');
    return assetAsBytes.toString();
  }
  
  async setPosition(ctx, id, latitude, longitude) {
    console.info('============= START : Set position ===========');
    const keyAsBytes = await ctx.stub.getState(id); 
    if (!keyAsBytes || keyAsBytes.length === 0) {
      throw new Error(`${id} does not exist`);
    }
    let key = JSON.parse(keyAsBytes.toString());
    key.latitude = latitude;
    key.longitude = longitude;
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(key)));
    console.info('============= END : Set position ===========');
    return ctx.stub.getTxID();
  }

  async getHistory(ctx, id) {
    console.info('============= START : Query History ===========');
    let iterator = await ctx.stub.getHistoryForKey(id);
    let result = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value) {
        console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
        const obj = JSON.parse(res.value.value.toString('utf8'));
        result.push(obj);
      }
      res = await iterator.next();
    }
    await iterator.close();
    console.info('============= END : Query History ===========');
    return result;  
  }


}

module.exports = SupplyChain;
