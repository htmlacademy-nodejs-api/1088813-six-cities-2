import {Request} from 'express';
import {RequestBody, RequestParams} from '../../libs/rest/index.js';
import {CreateSuggestionDto} from './dto/create-suggestion.dto.js';

export type CreateSuggestionRequest = Request<RequestParams, RequestBody, CreateSuggestionDto>;
