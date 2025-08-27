import {
  BaseController,
  DocumentExistsMiddleware, HttpError,
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
import {Config, RestSchema} from '../../libs/config/index.js';
import {CreateUserRequest} from './create-user-request.type.js';
import {LoginUserRequest} from './login-user-request.type.js';
import {UpdateUserRequest} from './update-user-request.type.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserExistsMiddleware} from './middleware/user-exists.middleware.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import {UpdateUserDto} from './dto/update-user.dto.js';
import {UploadFileMiddleware} from '../../libs/rest/middleware/upload-file.middleware.js';
import {AuthService} from '../auth/index.js';
import {LoggedUserRdo} from './rdo/logged-user.rdo.js';
import {PrivateRouteMiddleware} from '../../libs/rest/middleware/private-route.middleware.js';
import {StatusCodes} from 'http-status-codes';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto),
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
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
      path: '/update/:id',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
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
    this.addRoute({
      path: '/:id/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
        new DocumentExistsMiddleware(this.userService, 'User', 'id'),
      ]
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

  public async login({body}: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      user,
      token,
    });

    this.ok(res, responseData);
  }

  public async checkAuthenticate({ tokenPayload }: LoginUserRequest, res: Response): Promise<void> {
    const foundedUser = await this.userService.findByEmail(tokenPayload.email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    this.ok(res, fillDTO(UserRdo, foundedUser));
  }

  public async update(req: UpdateUserRequest<string>, res: Response): Promise<void> {
    const {body, params} = req;
    const {id} = params;

    const result = await this.userService.updateById(id, body);

    this.ok(res, fillDTO(UserRdo, result));
  }

  public async findOrCreate({body}: CreateUserRequest, res: Response): Promise<void> {
    const result = await this.userService.findOrCreate(body, this.config.get('SALT'));

    this.ok(res, fillDTO(UserRdo, result));
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const result = await this.userService.addAvatar(req.params.id, req.file?.path || '');

    this.created(res, {
      filepath: req.file?.path,
      user: result,
    });
  }
}
