'use strict';

const { Contract } = require('fabric-contract-api');

class SypplyChain extends Contract {


  async addTuna(ctx, tuna) {
    console.info('============= START : Add tuna ===========');
    await ctx.stub.putState(JSON.parse(tuna).id.toString(), Buffer.from(tuna));
    console.info('============= END : Add tuna ===========');
    return ctx.stub.getTxID()
  }

  async addSushi(ctx, sushi) {
    console.info('============= START : Add sushi ===========');
    await ctx.stub.putState(JSON.parse(sushi.id).toString(), Buffer.from(sushi));
    console.info('============= END : Add sushi ===========');
  }

  async querySushi(ctx, sushiId) {
    console.info('============= START : Query sushi ===========');
    const sushiAsBytes = await ctx.stub.getState(sushiId); 
    if (!sushiAsBytes || sushiAsBytes.length === 0) {
      throw new Error(`${sushiId} does not exist`);
    }
    console.log(sushiAsBytes.toString());
    console.info('============= END : Query sushi ===========');
    return sushiAsBytes.toString();
  }
  
    async queryTuna(ctx, tunaId) {
    console.info('============= START : Query sushi ===========');
    const tunaAsBytes = await ctx.stub.getState(tunaId); 
    if (!tunaAsBytes || tunaAsBytes.length === 0) {
      throw new Error(`${tunaId} does not exist`);
    }
    console.log(tunaAsBytes.toString());
    console.info('============= END : Query sushi ===========');
    return tunaAsBytes.toString();
  }

  async getHistorySushi(ctx, sushiId) {
    console.info('============= START : Query sushi ===========');
    let iterator = await ctx.stub.getHistoryForKey(sushiId);
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
    return result;  
  }


}

module.exports = SypplyChain;