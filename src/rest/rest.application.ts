import {Logger} from '../shared/libs/logger/index.js';
import {Config} from '../shared/libs/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../shared/consts/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {getMongoURI} from '../shared/helpers/index.js';
import {RestSchema} from '../shared/libs/config/index.js';
import express, {Express} from 'express';
import {Controller, ExceptionFilter} from '../shared/libs/rest/index.js';

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
    this.server.use(express.json());
  }

  private async _initExceptionFilter() {
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
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
