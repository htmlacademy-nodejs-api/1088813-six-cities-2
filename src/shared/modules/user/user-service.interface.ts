import {CreateUserDto} from './dto/create-user.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {UpdateUserDto} from './dto/update-user.dto.js';
import {DocumentExists} from '../../types/document-exists.interface.js';

export interface UserService extends DocumentExists {
  createUser(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(id: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  userExistsByEmail?(email: string): Promise<boolean>;
  addAvatar(id: string, avatarPath: string): Promise<DocumentType<UserEntity> | null>;
}
