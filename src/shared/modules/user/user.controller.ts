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
import {Request, Response} from 'express';
import {UserService} from './user-service.interface.js';
import {fillDTO} from '../../helpers/index.js';
import {UserRdo} from './rdo/user.rdo.js';
import {StatusCodes} from 'http-status-codes';
import {Config, RestSchema} from '../../libs/config/index.js';
import {CreateUserRequest} from './create-user-request.type.js';
import {LoginUserRequest} from './login-user-request.type.js';
import {UpdateUserRequest} from './update-user-request.type.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserExistsMiddleware} from './middleware/user-exists.middleware.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import {UpdateUserDto} from './dto/update-user.dto.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.userService, 'User', 'id'),
      ],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
        new UserExistsMiddleware(this.userService, 'User', 'email', true),
      ],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto),
      ]
    });
    this.addRoute({
      path: '/update/:id',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateUserDto),
        new DocumentExistsMiddleware(this.userService, 'User', 'id'),
      ],
    });
    this.addRoute({
      path: '/findOrCreate',
      method: HttpMethod.Post,
      handler: this.findOrCreate,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const {id} = req.params;

    const user = await this.userService.findById(id);
    const responseData = fillDTO(UserRdo, user);
    this.ok(res, responseData);
  }

  public async register(
    {body}: CreateUserRequest,
    res: Response): Promise<void> {
    const result = await this.userService.createUser(body, this.config.get('SALT'));

    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({body}: LoginUserRequest, _res: Response): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (!existUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Method not implemented',
      'UserController',
    );
  }

  public async update(req: UpdateUserRequest<string>, res: Response): Promise<void> {
    const {body, params} = req;
    const {id} = params;

    const existUser = await this.userService.findById(id);

    if (existUser) {
      const result = await this.userService.updateById(id, body);

      this.ok(res, fillDTO(UserRdo, result));
    }

    throw new HttpError(
      StatusCodes.NOT_FOUND,
      `User with id ${id} not found`,
      'UserController',
    );
  }

  public async findOrCreate({body}: CreateUserRequest, res: Response): Promise<void> {
    const result = await this.userService.findOrCreate(body, this.config.get('SALT'));

    this.ok(res, fillDTO(UserRdo, result));
  }
}
