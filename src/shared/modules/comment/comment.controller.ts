import {BaseController, HttpError, HttpMethod, RequestParams} from '../../libs/rest/index.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../consts/index.js';
import {Logger} from '../../libs/logger/index.js';
import {CommentService} from './comment-service.interface.js';
import {CreateCommentRequest} from './create-comment-request.type.js';
import {SuggestionService} from '../suggestion/index.js';
import {fillDTO, isValidId} from '../../helpers/index.js';
import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import {CommentRdo} from './rdo/comment.rdo.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private commentService: CommentService,
    @inject(Component.SuggestionService) private suggestionService: SuggestionService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAll});
    this.addRoute({path: '/:suggestionId', method: HttpMethod.Get, handler: this.getAllBySuggestionId});
  }

  public async index({body}: CreateCommentRequest, res: Response): Promise<void> {
    const notFoundError = new HttpError(
      StatusCodes.NOT_FOUND,
      `Suggestion with id ${body.suggestionId} not found.`,
      'SuggestionController',
    );

    if (isValidId(body.suggestionId)) {
      const existSuggestion = await this.suggestionService.findById(body.suggestionId);

      if (existSuggestion) {
        const result = await this.commentService.addComment(body);
        await this.suggestionService.incCommentCount(body.suggestionId);
        const responseData = fillDTO(CommentRdo, result);
        this.created(res, responseData);
      }

      throw notFoundError;
    }

    throw notFoundError;
  }

  public async getAll(_req: Request, res: Response): Promise<void> {
    const result = await this.commentService.getAllComments();
    const responseData = fillDTO(CommentRdo, result);
    this.ok(res, responseData);
  }

  public async getAllBySuggestionId({params}: Request<RequestParams<string>>, res: Response): Promise<void> {
    const {suggestionId} = params;
    const notFoundError = new HttpError(
      StatusCodes.NOT_FOUND,
      `Suggestion with id ${suggestionId} not found.`,
      'SuggestionController',
    );

    if (isValidId(suggestionId)) {
      const existSuggestion = await this.suggestionService.findById(suggestionId);

      if (existSuggestion) {
        const result = await this.commentService.getAllCommentsBySuggestionId(suggestionId);
        const responseData = fillDTO(CommentRdo, result);
        this.ok(res, responseData);
      }

      throw notFoundError;
    }

    throw notFoundError;
  }
}
