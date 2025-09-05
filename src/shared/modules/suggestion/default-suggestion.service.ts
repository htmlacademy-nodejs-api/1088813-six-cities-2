import {SuggestionService} from './suggestion-service.interface.js';
import {inject, injectable} from 'inversify';
import {Component, SortType} from '../../consts/index.js';
import {Logger} from '../../libs/logger/index.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {SuggestionEntity} from './suggestion.entity.js';
import {CreateSuggestionDto} from './dto/create-suggestion.dto.js';
import {UpdateSuggestionDto} from './dto/update-suggestion.dto.js';
import {AGGREGATE_COMMENT, SuggestionSettings} from './suggestion.constant.js';
import {Types} from 'mongoose';

@injectable()
export class DefaultSuggestionService implements SuggestionService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.SuggestionModel) private readonly suggestionModel: types.ModelType<SuggestionEntity>,
  ) {}

  public async createSuggestion(createSuggestionDto: CreateSuggestionDto): Promise<DocumentType<SuggestionEntity>> {
    const suggestion = await this.suggestionModel.create(createSuggestionDto);
    this.logger.info(`Suggestion created: ${suggestion.title}`);

    const result = await this.suggestionModel.aggregate<types.DocumentType<SuggestionEntity>>([
      {
        $match: { _id: new Types.ObjectId(suggestion._id) },
      },
      ...AGGREGATE_COMMENT,
    ]).exec();

    return result[0];
  }

  public async findById(id: string): Promise<DocumentType<SuggestionEntity> | null> {
    const result = await this.suggestionModel
      .aggregate<types.DocumentType<SuggestionEntity>>([
        {
          $match: { _id: new Types.ObjectId(id) },
        },
        ...AGGREGATE_COMMENT,
      ])
      .exec();

    return result[0] ?? null;
  }

  public async updateById(id: string, dto: UpdateSuggestionDto): Promise<DocumentType<SuggestionEntity> | null> {
    await this.suggestionModel
      .findByIdAndUpdate(id, dto)
      .exec();

    const result = await this.suggestionModel
      .aggregate<types.DocumentType<SuggestionEntity>>([
        {
          $match: { _id: new Types.ObjectId(id) },
        },
        ...AGGREGATE_COMMENT,
      ]).exec();

    return result[0] ?? null;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.suggestionModel.exists({_id: documentId})) !== null;
  }

  public async deleteById(id: string): Promise<DocumentType<SuggestionEntity> | null> {
    return this.suggestionModel.findByIdAndDelete(id).exec();
  }

  public async getAll(count = SuggestionSettings.MAX_SUGGESTIONS_COUNT): Promise<DocumentType<SuggestionEntity>[]> {
    return this.suggestionModel
      .aggregate<types.DocumentType<SuggestionEntity>>([
        ...AGGREGATE_COMMENT,
        {
          $sort: { createdAt: SortType.Down }
        },
        {
          $limit: count,
        }
      ])
      .exec();
  }

  public async findNew(count: number): Promise<DocumentType<SuggestionEntity>[]> {
    return this.suggestionModel
      .aggregate<types.DocumentType<SuggestionEntity>>([
        ...AGGREGATE_COMMENT,
        {
          $sort: { createdAt: SortType.Down }
        },
        {
          $limit: count,
        }
      ])
      .exec();
  }

  public async findPremium(): Promise<DocumentType<SuggestionEntity>[]> {
    return this.suggestionModel
      .aggregate<types.DocumentType<SuggestionEntity>>([
        ...AGGREGATE_COMMENT,
        {
          $match: { premium: true }
        }
      ])
      .exec();
  }

  public async findFavourite(userId: string): Promise<DocumentType<SuggestionEntity>[]> {
    return this.suggestionModel
      .aggregate<types.DocumentType<SuggestionEntity>>([
        {
          $match: { favourite: true, authorId: new Types.ObjectId(userId) },
        },
        ...AGGREGATE_COMMENT
      ])
      .exec();
  }

  public async incCommentCount(id: string): Promise<DocumentType<SuggestionEntity> | null> {
    return this.suggestionModel
      .findByIdAndUpdate(id, { '$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async isAuthor(suggestionId:string, authorId:string): Promise<boolean> {
    const suggestion = await this.suggestionModel.findById(suggestionId).select('authorId').lean();
    if (!suggestion) {
      return false;
    }

    return suggestion.authorId.toString() === authorId;
  }
}
