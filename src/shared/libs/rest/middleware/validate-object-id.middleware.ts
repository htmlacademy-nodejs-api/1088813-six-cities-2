import {Middleware} from './middleware.interface.js';
import {Response, Request, NextFunction} from 'express';
import {Types} from 'mongoose';
import {HttpError} from '../errors/index.js';
import {StatusCodes} from 'http-status-codes';
import {Logger} from '../../logger/index.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(
    private param: string,
    private readonly logger?: Logger,
    private test?: string
  ) {}

  public execute({ params }: Request, _res: Response, next: NextFunction) {
    const objectId = params[this.param];

    this.logger?.info(this.test || 'Ne peredal');

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is not a valid ObjectID`,
      'ValidateObjectIdMiddleware',
    );
  }
}
