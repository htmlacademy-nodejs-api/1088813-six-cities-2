import {IsBoolean} from 'class-validator';

export class ChangeFavouriteDto {
  @IsBoolean({
    message: 'Must be a boolean',
  })
  public favourite: boolean;
}
