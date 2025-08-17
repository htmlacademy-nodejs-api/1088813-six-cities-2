import {ContainerModule} from 'inversify';
import {SuggestionService} from './suggestion-service.interface.js';
import {Component} from '../../consts/index.js';
import {DefaultSuggestionService} from './default-suggestion.service.js';
import {types} from '@typegoose/typegoose';
import {SuggestionEntity, SuggestionModel} from './suggestion.entity.js';
import { Controller } from '../../libs/rest/index.js';
import {SuggestionController} from './suggestion.controller.js';

export function createSuggestionContainer() {
  return new ContainerModule(
    (options) => {
      options.bind<SuggestionService>(Component.SuggestionService).to(DefaultSuggestionService).inSingletonScope();
      options.bind<types.ModelType<SuggestionEntity>>(Component.SuggestionModel).toConstantValue(SuggestionModel);
      options.bind<Controller>(Component.SuggestionController).to(SuggestionController).inSingletonScope();
    }
  );
}
