import boom from "@hapi/boom";
import  Joi, { AnySchema }  from 'joi';

import { Express, NextFunction } from "express";
import { ObjectType } from "typescript";
function validatorHandler(schema:AnySchema, data:any) {
  return (request: Express.Request, response: Express.Response, next:NextFunction) => {
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      next(boom.badRequest(validationResult.error.message));
    }
    next();
  }
}
export default validatorHandler;
