import {
  BaseController, DocumentExistsMiddleware,
  HttpMethod,
  RequestParams, ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../consts/index.js';
import {Logger} from '../../libs/logger/index.js';
import {CommentService} from './comment-service.interface.js';
import {CreateCommentRequest} from './create-comment-request.type.js';
import {SuggestionService} from '../suggestion/index.js';
import {fillDTO, parseNumberPartialFromString} from '../../helpers/index.js';
import {Request, Response} from 'express';
import {CommentRdo} from './rdo/comment.rdo.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {PrivateRouteMiddleware} from '../../libs/rest/middleware/private-route.middleware.js';
import {PathTransformer} from '../../libs/rest/transform/path-transformer.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private commentService: CommentService,
    @inject(Component.SuggestionService) private suggestionService: SuggestionService,
    @inject(Component.PathTransformer) pathTransformer: PathTransformer,
  ) {
    super(logger, pathTransformer);

    this.logger.info('Register routes for CommentController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.suggestionService, 'Suggestion', 'suggestionId')
      ],
    });
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAll});
    this.addRoute({
      path: '/:suggestionId',
      method: HttpMethod.Get,
      handler: this.getAllBySuggestionId,
      middlewares: [
        new ValidateObjectIdMiddleware('suggestionId'),
      ],
    });
  }

  public async index({body, tokenPayload}: CreateCommentRequest, res: Response): Promise<void> {
    const result = await this.commentService.addComment({...body, authorId: tokenPayload.id});
    await this.suggestionService.incCommentCount(body.suggestionId);
    const responseData = fillDTO(CommentRdo, result);
    this.created(res, responseData);
  }

  public async getAll(_req: Request, res: Response): Promise<void> {
    const result = await this.commentService.getAllComments();
    const responseData = fillDTO(CommentRdo, result);
    this.ok(res, responseData);
  }

  public async getAllBySuggestionId({params, query}: Request<RequestParams<string>>, res: Response): Promise<void> {
    const {suggestionId} = params;
    const {count} = query;

    const result = await this.commentService.getAllCommentsBySuggestionId(suggestionId, parseNumberPartialFromString(count as string));
    const responseData = fillDTO(CommentRdo, result);
    this.ok(res, responseData);
  }
}
