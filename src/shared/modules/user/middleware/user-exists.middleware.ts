import {HttpError, Middleware} from '../../../libs/rest/index.js';
import {DocumentExists} from '../../../types/document-exists.interface.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

export class UserExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly fieldName: string,
    private readonly isRegister?: boolean,
  ) {}

  public async execute({body}: Request, _res: Response, next: NextFunction): Promise<void> {
    const email = body[this.fieldName];

    if (await this.service.userExistsByEmail?.(email)) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `${this.entityName} with email ${body.email} already exists`,
        'UserExistsMiddleware'
      );
    }

    if (! await this.service.userExistsByEmail?.(email) && !this.isRegister) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `${this.entityName} with email ${body.email} not found`,
        'UserExistsMiddleware',
      );
    }

    next();
  }
}
