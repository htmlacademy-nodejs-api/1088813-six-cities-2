import {Request} from 'express';
import {RequestBody, RequestParams} from '../../libs/rest/index.js';
import {UpdateSuggestionDto} from './dto/update-suggestion.dto.js';

export type UpdateSuggestionRequest<T = unknown> = Request<RequestParams<T>, RequestBody, UpdateSuggestionDto>;
