import {ContainerModule} from 'inversify';
import {UserService} from './user-service.interface.js';
import {Component} from '../../consts/index.js';
import {DefaultUserService} from './default-user.service.js';
import {types} from '@typegoose/typegoose';
import {UserEntity, UserModel} from './user.entity.js';
import { Controller } from '../../libs/rest/index.js';
import {UserController} from './user.controller.js';

export function createUserContainer() {
  return new ContainerModule(
    (options) => {
      options.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
      options.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
      options.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();
    }
  );
}
