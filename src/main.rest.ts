import 'reflect-metadata';
import {RestApplication} from './rest/index.js';
import {Container} from 'inversify';
import {Component} from './shared/consts/index.js';
import {createRestApplicationContainer} from './rest/rest.container.js';
import {createUserContainer} from './shared/modules/user/index.js';
import {createSuggestionContainer} from './shared/modules/suggestion/suggestion.container.js';
import {createCommentContainer} from './shared/modules/comment/index.js';
import {createAuthContainer} from './shared/modules/auth/index.js';

async function bootstrap() {
  const appContainer = new Container();

  await appContainer.load(
    createRestApplicationContainer(),
    createUserContainer(),
    createSuggestionContainer(),
    createCommentContainer(),
    createAuthContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);

  await application.init();
}

bootstrap();
