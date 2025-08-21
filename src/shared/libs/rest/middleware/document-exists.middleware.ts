import {Middleware} from './middleware.interface.js';
import {DocumentExists} from '../../../types/document-exists.interface.js';
import {NextFunction, Request, Response} from 'express';
import {HttpError} from '../errors/index.js';
import {StatusCodes} from 'http-status-codes';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({params, body}: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName] || body[this.paramName];

    if (! await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ObjectID: ${documentId} not found`,
        'DocumentExistsMiddleware',
      );
    }

    next();
  }
}
