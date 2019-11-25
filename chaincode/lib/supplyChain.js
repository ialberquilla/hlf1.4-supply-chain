/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class SypplyChain extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const orders = [
            {
                quantity: '14',
                type: 'Blue',
            },
        ];

        for (let i = 0; i < orders.length; i++) {
            orders[i].docType = 'order';
            await ctx.stub.putState('ORDER' + i, Buffer.from(JSON.stringify(orders[i])));
            console.info('Added <--> ', orders[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryOrder(ctx, orderNumber) {
        const orderAsBytes = await ctx.stub.getState(orderNumber); // get the order from chaincode state
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`${orderNumber} does not exist`);
        }
        console.log(orderAsBytes.toString());
        return orderAsBytes.toString();
    }
  
     async createOrder(ctx, orderNumber, quantity, type) {
        console.info('============= START : Create Order ===========');

        const order = {
            quantity,
            type
        };

        await ctx.stub.putState(orderNumber, Buffer.from(JSON.stringify(order)));
        console.info('============= END : Create Car ===========');
    }

}

module.exports = SypplyChain;
