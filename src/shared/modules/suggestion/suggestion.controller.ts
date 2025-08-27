import {
  BaseController, DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../consts/index.js';
import {Logger} from '../../libs/logger/index.js';
import {SuggestionService} from './suggestion-service.interface.js';
import {NextFunction, Request, Response} from 'express';
import {fillDTO} from '../../helpers/index.js';
import {SuggestionRdo} from './rdo/suggestion.rdo.js';
import {CreateSuggestionRequest} from './create-suggestion-request.type.js';
import {UpdateSuggestionRequest} from './update-suggestion-request.type.js';
import {StatusCodes} from 'http-status-codes';
import {DeleteSuggestionRequest} from './delete-suggestion-request.type.js';
import {CreateSuggestionDto} from './dto/create-suggestion.dto.js';
import {UpdateSuggestionDto} from './dto/update-suggestion.dto.js';
import {PrivateRouteMiddleware} from '../../libs/rest/middleware/private-route.middleware.js';

@injectable()
export class SuggestionController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.SuggestionService) private readonly suggestionService: SuggestionService,
  ) {
    super(logger);

    this.logger.info('Register routes for SuggestionController');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute(
      {path: '/',
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateDtoMiddleware(CreateSuggestionDto)
        ],
      });
    this.addRoute({
      path: '/update/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id', this.logger, 'update'),
        new ValidateDtoMiddleware(UpdateSuggestionDto),
        new DocumentExistsMiddleware(this.suggestionService, 'Suggestion', 'id'),
      ],
    });
    this.addRoute({path: '/findNew', method: HttpMethod.Get, handler: this.findNew});
    this.addRoute({
      path: '/findPremium',
      method: HttpMethod.Get,
      handler: this.findPremium,
    });
    this.addRoute({
      path: '/findFavourite',
      method: HttpMethod.Get,
      handler: this.findFavourite,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id', this.logger, 'delete'),
        new DocumentExistsMiddleware(this.suggestionService, 'Suggestion', 'id'),
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.findById,
      middlewares: [
        new ValidateObjectIdMiddleware('id', this.logger, 'get by id'),
        new DocumentExistsMiddleware(this.suggestionService, 'Suggestion', 'id'),
      ],
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const suggestions = await this.suggestionService.getAll();
    const responseData = fillDTO(SuggestionRdo, suggestions);
    this.ok(res, responseData);
  }

  public async create({body, tokenPayload}: CreateSuggestionRequest, res: Response, _next: NextFunction): Promise<void> {
    const result = await this.suggestionService.createSuggestion({...body, authorId: tokenPayload.id});
    const responseData = fillDTO(SuggestionRdo, result);
    this.created(res, responseData);
  }

  public async update({body, params}: UpdateSuggestionRequest<string>, res: Response): Promise<void> {
    const {id} = params;

    const result = await this.suggestionService.updateById(id, body);
    const responseData = fillDTO(SuggestionRdo, result);
    this.ok(res, responseData);
  }

  public async delete({params}: DeleteSuggestionRequest<string>, res: Response): Promise<void> {
    const {id} = params;

    const result = await this.suggestionService.deleteById(id);
    const responseData = fillDTO(SuggestionRdo, result);
    this.ok(res, responseData);
  }

  public async findById({params}: DeleteSuggestionRequest<string>, res: Response): Promise<void> {
    const {id} = params;

    const result = await this.suggestionService.findById(id);
    const responseData = fillDTO(SuggestionRdo, result);
    this.ok(res, responseData);
  }

  public async findNew({query}: Request, res: Response): Promise<void> {
    const {count} = query;

    if (!count) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        '{?count=} is required',
        'SuggestionController',
      );
    }

    const numberCount = Number.parseInt(count as string, 10);

    const result = await this.suggestionService.findNew(numberCount);
    const responseData = fillDTO(SuggestionRdo, result);
    this.ok(res, responseData);
  }

  public async findFavourite({tokenPayload}: Request, res: Response): Promise<void> {
    const result = await this.suggestionService.findFavourite(tokenPayload.id);
    const responseData = fillDTO(SuggestionRdo, result);
    this.ok(res, responseData);
  }

  public async findPremium(_req: Request, res: Response): Promise<void> {
    const result = await this.suggestionService.findPremium();
    const responseData = fillDTO(SuggestionRdo, result);
    this.ok(res, responseData);
  }
}
