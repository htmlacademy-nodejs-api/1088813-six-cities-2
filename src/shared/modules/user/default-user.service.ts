import {UserService} from './user-service.interface.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../consts/index.js';
import {Logger} from '../../libs/logger/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async createUser(createUserDto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(createUserDto);
    user.setPassword(createUserDto.password, salt);

    const result = this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email:string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findById(id:string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({id});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.createUser(dto, salt);
  }
}
