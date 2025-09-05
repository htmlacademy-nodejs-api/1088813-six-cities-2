import {Logger} from '../shared/libs/logger/index.js';
import {Config} from '../shared/libs/config/index.js';
import {inject, injectable} from 'inversify';
import {Component} from '../shared/consts/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {getFullServerPath, getMongoURI} from '../shared/helpers/index.js';
import {RestSchema} from '../shared/libs/config/index.js';
import express, {Express} from 'express';
import {
  Controller,
  ExceptionFilter,
  HttpErrorExceptionFilter,
  ValidationExceptionFilter
} from '../shared/libs/rest/index.js';
import {AuthExceptionFilter} from '../shared/modules/auth/index.js';
import {ParseTokenMiddleware} from '../shared/libs/rest/middleware/parse-token.middleware.js';
import {StaticDirectories} from './rest.enum.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.SuggestionController) private readonly suggestionController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: AuthExceptionFilter,
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: HttpErrorExceptionFilter,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: ValidationExceptionFilter,
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USERNAME'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/user', this.userController.router);
    this.server.use('/suggestions', this.suggestionController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async _initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(express.json());
    this.server.use(
      StaticDirectories.STATIC_UPLOAD_DIRECTORY,
      express.static(this.config.get('UPLOAD_DIRECTORY')),
    );
    this.server.use(
      StaticDirectories.STATIC_FILES_DIRECTORY,
      express.static(this.config.get('STATIC_DIRECTORY')),
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  private async _initExceptionFilter() {
    this.server.use(this.authExceptionFilter.catch.bind(this.appExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('RestApplication initialized');
    this.logger.info(`Get value from env $PORT ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this._initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filter');
    await this._initExceptionFilter();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Try to init server...');
    await this._initServer();
    this.logger.info(`🚀 Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }
}
