import {Logger} from '../shared/libs/logger/index.js';
import {Config} from '../shared/libs/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../shared/consts/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {getMongoURI} from '../shared/helpers/index.js';
import {RestSchema} from '../shared/libs/config/index.js';
import {DefaultUserService} from '../shared/modules/user/index.js';
import {UserType} from '../shared/enums/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
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

    const user = await this.userService.findOrCreate({
      password: '123321',
      avatar: 'img.jpeg',
      email: 'kuzmich1994@test.ru',
      firstName: 'Sergey',
      lastName: 'Kuzmichev',
      type: UserType.PRO,
    }, this.config.get('SALT'));

    console.log(user);

    this.logger.info('Init database completed');
  }
}
