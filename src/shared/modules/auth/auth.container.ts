import {ContainerModule} from 'inversify';
import {AuthService} from './auth-service.interface.js';
import {Component} from '../../consts/index.js';
import {DefaultAuthService} from './default-auth.service.js';
import {ExceptionFilter} from '../../libs/rest/index.js';
import {AuthExceptionFilter} from './auth.exception-filter.js';

export function createAuthContainer() {
  return new ContainerModule(
    (options) => {
      options.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
      options.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();
    }
  );
}
