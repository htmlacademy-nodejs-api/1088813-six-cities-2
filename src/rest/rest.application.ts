import {Logger} from '../shared/libs/logger/index.js';
import {Config} from '../shared/libs/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../shared/consts/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {getMongoURI} from '../shared/helpers/index.js';
import {RestSchema} from '../shared/libs/config/index.js';
import {CommentService} from '../shared/modules/comment/index.js';
import {SuggestionService} from '../shared/modules/suggestion/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.SuggestionService) private readonly suggestionService: SuggestionService,
  ) {}

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USERNAME'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('RestApplication initialized');
    this.logger.info(`Get value from env $PORT ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this.initDb();

    this.logger.info('Init database completed');

    // const createResult = await this.commentService.addComment({
    //   rating: 5,
    //   authorId: '689a32d7e784e798712367bd',
    //   suggestionId: '689a32d7e784e798712367d3',
    //   text: 'Comment'
    // });

    const result = await this.commentService.getAllComments();
    const resultS = await this.suggestionService.updateById('689a32d7e784e798712367bf', {
      title: 'Домик в лесу 1234'
    });
    //
    // console.log(createResult);
    console.log(result);
    console.log(resultS);

  }
}
