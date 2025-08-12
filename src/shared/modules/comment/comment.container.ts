import {ContainerModule} from 'inversify';
import {Component} from '../../consts/index.js';
import {types} from '@typegoose/typegoose';
import {CommentService} from './comment-service.interface.js';
import {DefaultCommentService} from './default-comment.service.js';
import {CommentEntity, CommentModel} from './comment.entity.js';

export function createCommentContainer() {
  return new ContainerModule(
    (options) => {
      options.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
      options.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
    }
  );
}
