import {CreateSuggestionDto} from './dto/create-suggestion.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {SuggestionEntity} from './suggestion.entity.js';

export interface SuggestionService {
  createSuggestion(dto: CreateSuggestionDto): Promise<DocumentType<SuggestionEntity>>;
  findById(id: string): Promise<DocumentType<SuggestionEntity> | null>;
  getAll(): Promise<DocumentType<SuggestionEntity>[]>;
}
