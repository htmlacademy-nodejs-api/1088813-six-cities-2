import {CreateSuggestionDto} from './dto/create-suggestion.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {SuggestionEntity} from './suggestion.entity.js';
import {UpdateSuggestionDto} from './dto/update-suggestion.dto.js';
import {DocumentExists} from '../../types/document-exists.interface.js';

export interface SuggestionService extends DocumentExists {
  createSuggestion(dto: CreateSuggestionDto): Promise<DocumentType<SuggestionEntity>>;
  findById(id: string): Promise<DocumentType<SuggestionEntity> | null>;
  getAll(count?: number): Promise<DocumentType<SuggestionEntity>[]>;
  updateById(id: string, dto: UpdateSuggestionDto): Promise<DocumentType<SuggestionEntity> | null>;
  deleteById(id: string): Promise<DocumentType<SuggestionEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  findPremium(city: string): Promise<DocumentType<SuggestionEntity>[]>;
  findFavourite(userId: string): Promise<DocumentType<SuggestionEntity>[]>;
  incCommentCount(id: string): Promise<DocumentType<SuggestionEntity> | null>;
  isAuthor(suggestionId: string, authorId: string): Promise<boolean>;
  changeFavouriteStatus(id: string, userId: string, favourite: boolean): Promise<DocumentType<SuggestionEntity> | null>;
}
