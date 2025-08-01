import {Command} from './command.interface.js';
import {TsvFileReader} from '../../shared/libs/file-reader/tsv-file-reader.js';
import chalk from 'chalk';
import {createSuggestion, getErrorMessage, getMongoURI} from '../../shared/helpers/index.js';
import {UserService} from '../../shared/modules/user/user-service.interface.js';
import {DefaultSuggestionService, SuggestionModel, SuggestionService} from '../../shared/modules/suggestion/index.js';
import {DatabaseClient, MongoDatabaseClient} from '../../shared/libs/database-client/index.js';
import {Logger} from '../../shared/libs/logger/index.js';
import {ConsoleLogger} from '../../shared/libs/logger/console.logger.js';
import {DefaultUserService, UserModel} from '../../shared/modules/user/index.js';
import {RentSuggestion} from '../../shared/types/index.js';
import {CommandConstant} from './command.constant.js';
import {UserType} from '../../shared/enums/index.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private suggestionService: SuggestionService;
  private databaseClicent: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.suggestionService = new DefaultSuggestionService(this.logger, SuggestionModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClicent = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const suggestion = createSuggestion(line);
    await this.saveSuggestion(suggestion);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported`);
    this.databaseClicent.disconnect();
  }

  private async saveSuggestion(suggestion: RentSuggestion) {
    const user = await this.userService.findOrCreate({
      ...suggestion.author,
      password: CommandConstant.DEFAULT_USER_PASSWORD,
      type: suggestion.author.type || UserType.DEFAULT,
    }, this.salt);

    await this.suggestionService.createSuggestion({
      ...suggestion,
      authorId: user.id,
    });
  }

  public async execute(fileName: string, login: string, password: string, host: string, dbName: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, CommandConstant.DEFAULT_DB_PORT, dbName);
    this.salt = salt;


    await this.databaseClicent.connect(uri);

    const fileReader = new TsvFileReader(fileName.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`${chalk.redBright('Can\'t import data from file:')} ${chalk.whiteBright(fileName)}`);
      console.error(getErrorMessage(error));
    }
  }
}
