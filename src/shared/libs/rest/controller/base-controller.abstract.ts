import {Controller} from './controller.interface.js';
import {Response, Router} from 'express';
import {injectable} from 'inversify';
import {Route} from '../types/route.interface.js';
import {ContentTypes} from '../constants/controller.constants.js';
import {StatusCodes} from 'http-status-codes';
import {Logger} from '../../logger/index.js';
import asyncHandler from 'express-async-handler';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  constructor(
    protected readonly logger: Logger,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route) {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    this._router[route.method](route.path, wrapperAsyncHandler);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type(ContentTypes.DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T) {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T) {
    this.send(res, StatusCodes.OK, data);
  }
}
