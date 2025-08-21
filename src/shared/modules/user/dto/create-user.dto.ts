import {UserType} from '../../../enums/index.js';
import {IsEmail, IsEnum, IsString, Length} from 'class-validator';
import {CreateUserMessages} from './create-user.messages.js';

export class CreateUserDto {
  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessages.avatar.invalidFormat })
  public avatar: string;

  @IsString({ message: CreateUserMessages.firstName.invalidFormat })
  @Length(1, 15, { message: CreateUserMessages.firstName.lengthField })
  public firstName: string;

  @IsString({ message: CreateUserMessages.lastName.invalidFormat })
  @Length(1, 15, { message: CreateUserMessages.lastName.lengthField })
  public lastName: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessages.password.lengthField })
  public password: string;

  @IsString({ message: CreateUserMessages.type.invalidFormat })
  @IsEnum(UserType, { message: CreateUserMessages.type.invalidType })
  public type: UserType;
}
