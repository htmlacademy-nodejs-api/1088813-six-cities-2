import {Middleware} from './middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import multer, {diskStorage} from 'multer';
import {extension} from 'mime-types';
import * as crypto from 'node:crypto';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDir: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction) {
    const storage = diskStorage({
      destination: this.uploadDir,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const fileName = crypto.randomUUID();
        callback(null, `${fileName}.${fileExtension}`);
      },
    });

    const uploadSingleFileMiddleware = multer({ storage })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
