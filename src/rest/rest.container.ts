import {ContainerModule} from 'inversify';
import {RestApplication} from './rest.application.js';
import {Component} from '../shared/consts/index.js';
import {Logger, PinoLogger} from '../shared/libs/logger/index.js';
import {Config, RestConfig, RestSchema} from '../shared/libs/config/index.js';
import {DatabaseClient, MongoDatabaseClient} from '../shared/libs/database-client/index.js';
import {ExceptionFilter} from '../shared/libs/rest/index.js';
import {AppExceptionFilter, HttpErrorExceptionFilter, ValidationExceptionFilter} from '../shared/libs/rest/index.js';
import {PathTransformer} from '../shared/libs/rest/transform/path-transformer.js';

export function createRestApplicationContainer() {
  return new ContainerModule(
    (options) => {
      options.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
      options.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
      options.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
      options.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
      options.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();
      options.bind<ExceptionFilter>(Component.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
      options.bind<ExceptionFilter>(Component.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
      options.bind<PathTransformer>(Component.PathTransformer).to(PathTransformer).inSingletonScope();
    }
  );
}
