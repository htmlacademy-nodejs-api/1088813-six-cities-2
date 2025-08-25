import {UserService} from './user-service.interface.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {inject, injectable} from 'inversify';
import {AGGREGATE_USER, Component} from '../../consts/index.js';
import {Logger} from '../../libs/logger/index.js';
import {UpdateUserDto} from './dto/update-user.dto.js';
import {Types} from 'mongoose';

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
    return this.userModel.findOne({_id: id});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.createUser(dto, salt);
  }

  public async updateById(id: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.userModel.exists({_id: documentId})) !== null;
  }

  public async userExistsByEmail(email:string): Promise<boolean> {
    return (await this.userModel.exists({email})) !== null;
  }

  public async addAvatar(id: string, avatarPath: string): Promise<DocumentType<UserEntity> | null> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, {avatar: avatarPath}, {new: true});
    const result = await this.userModel.aggregate<types.DocumentType<UserEntity>>([
      {
        $match: { _id: new Types.ObjectId(updatedUser?._id) },
      },
      {
        $project: {...AGGREGATE_USER },
      }
    ]).exec();

    return result[0] ?? null;
  }
}
