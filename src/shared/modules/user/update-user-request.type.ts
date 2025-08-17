import {Request} from 'express';
import {RequestBody, RequestParams} from '../../libs/rest/index.js';
import {UpdateUserDto} from './dto/update-user.dto.js';

export type UpdateUserRequest<T = unknown> = Request<RequestParams<T>, RequestBody, UpdateUserDto>;
