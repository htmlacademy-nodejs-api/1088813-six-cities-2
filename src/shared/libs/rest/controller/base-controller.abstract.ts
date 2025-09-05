import {Controller} from './controller.interface.js';
import {Response, Router} from 'express';
import {inject, injectable} from 'inversify';
import {Route} from '../types/route.interface.js';
import {ContentTypes} from '../constants/controller.constants.js';
import {StatusCodes} from 'http-status-codes';
import {Logger} from '../../logger/index.js';
import asyncHandler from 'express-async-handler';
import {Component} from '../../../consts/index.js';
import {PathTransformer} from '../transform/path-transformer.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;
  @inject(Component.PathTransformer)
  private readonly pathTransformer: PathTransformer;

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
    const middlewareHandlers = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );
    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.logger.info('PathTransformer instance:', this.pathTransformer);
    this.logger.info('Execute method:', this.pathTransformer?.execute);
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);
    res
      .type(ContentTypes.DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
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
