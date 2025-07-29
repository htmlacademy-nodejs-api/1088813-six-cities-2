import {SuggestionService} from './suggestion-service.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../consts/index.js';
import {Logger} from '../../libs/logger/index.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {SuggestionEntity} from './suggestion.entity.js';
import {CreateSuggestionDto} from './dto/create-suggestion.dto.js';

@injectable()
export class DefaultSuggestionService implements SuggestionService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.SuggestionModel) private readonly suggestionModel: types.ModelType<SuggestionEntity>,
  ) {}

  public async createSuggestion(createSuggestionDto: CreateSuggestionDto): Promise<DocumentType<SuggestionEntity>> {
    const suggestion = await this.suggestionModel.create({
      ...createSuggestionDto,
      longitude: createSuggestionDto?.coords?.longitude,
      latitude: createSuggestionDto?.coords?.latitude,
    });
    this.logger.info(`Suggestion created: ${suggestion.title}`);

    return suggestion;
  }

  public async findById(id: string): Promise<DocumentType<SuggestionEntity> | null> {
    const suggestion = await this.suggestionModel.findById(id);
    if (suggestion) {
      this.logger.info(`Suggestion found: ${suggestion.title}`);
    } else {
      this.logger.info('Suggestion not found');
    }

    return suggestion;
  }

  public async getAll(): Promise<DocumentType<SuggestionEntity>[]> {
    const suggestions = await this.suggestionModel.find();
    this.logger.info(`Suggestions found: ${suggestions.length}`);

    return suggestions;
  }
}
