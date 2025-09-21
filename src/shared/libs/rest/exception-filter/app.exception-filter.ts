import {ExceptionFilter} from './exception-filter.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../../consts/index.js';
import {Logger} from '../../logger/index.js';
import {Error} from 'mongoose';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {createErrorObject} from '../../../helpers/index.js';
import {ApplicationError} from '../types/application-error.enum.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
