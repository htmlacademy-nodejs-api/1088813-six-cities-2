import {HttpMethod} from './http-method.enum.js';
import {NextFunction, Request, Response} from 'express';
import {Middleware} from '../middleware/middleware.interface.js';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
