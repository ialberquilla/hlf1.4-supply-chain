import  Joi  from 'joi';

const startBlock  = Joi.number().integer();

const getChaincodeEventsSchema = Joi.object({
  startBlock: startBlock.required(),
});

export = { getChaincodeEventsSchema }
