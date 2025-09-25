import {CreateCommentDto} from './dto/create-comment.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';

export interface CommentService {
  addComment(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  getAllCommentsBySuggestionId(suggestionId: string, count?: number): Promise<DocumentType<CommentEntity>[]>;
}
