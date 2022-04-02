import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import Boom from "boom";
function logErrors(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error(err);
  next(err);
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

function boomErrorHandler(err: any | ErrorRequestHandler | Boom, req: Request, res: Response, next: NextFunction) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

export { logErrors, errorHandler, boomErrorHandler }
