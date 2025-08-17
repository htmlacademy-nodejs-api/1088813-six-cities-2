import {Request} from 'express';
import {RequestBody, RequestParams} from '../../libs/rest/index.js';

export type DeleteSuggestionRequest<T = unknown> = Request<RequestParams<T>, RequestBody>;
