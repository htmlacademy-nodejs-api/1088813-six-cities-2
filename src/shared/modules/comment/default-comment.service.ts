import {CommentService} from './comment-service.interface.js';
import {Logger} from '../../libs/logger/index.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../consts/index.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import mongoose, {Types} from 'mongoose';
import {AGGREGATE_COMMENT} from './comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async addComment(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const newComment = await this.commentModel.create(dto);
    this.logger.info(`Comment created: ${newComment.text}`);
    const result = await this.commentModel
      .aggregate<types.DocumentType<CommentEntity>>([
        {$match: {_id: new Types.ObjectId(newComment._id)},},
        ...AGGREGATE_COMMENT,
      ])
      .exec();

    return result[0];
  }

  public async getAllComments(): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .aggregate<types.DocumentType<CommentEntity>>(AGGREGATE_COMMENT)
      .exec();
  }

  public async getAllCommentsBySuggestionId(suggestionId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .aggregate<types.DocumentType<CommentEntity>>([
        {
          $match: {
            suggestionId: new mongoose.Types.ObjectId(suggestionId),
          },
        },
        ...AGGREGATE_COMMENT,
      ])
      .exec();
  }
}
