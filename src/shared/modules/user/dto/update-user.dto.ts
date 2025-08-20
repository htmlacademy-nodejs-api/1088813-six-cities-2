import {IsOptional, IsString, Length, Matches} from 'class-validator';
import {UpdateUserMessages} from './update-user.messages.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: UpdateUserMessages.avatar.invalidFormat })
  public avatar?: string;

  @IsOptional()
  @Matches(/^[^\d]+$/, { message: UpdateUserMessages.lastName.invalidFormat })
  @Length(1, 15, { message: UpdateUserMessages.firstName.lengthField })
  public firstName?: string;

  @IsOptional()
  @Matches(/^[^\d]+$/, { message: UpdateUserMessages.lastName.invalidFormat })
  @Length(1, 15, { message: UpdateUserMessages.lastName.lengthField })
  public lastName?: string;
}
