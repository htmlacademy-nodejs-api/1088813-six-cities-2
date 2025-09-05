import {Expose, Transform, Type} from 'class-transformer';
import {ConvenienceType, SuggestionType} from '../../../enums/index.js';
import {CoordinatesRdo} from '../../coordinates/index.js';
import {UserRdo} from '../../user/index.js';

export class SuggestionRdo {
  @Expose()
  public id: string;

  @Expose()
  public title?: string;

  @Expose()
  public description?: string;

  @Expose()
  public city?: string;

  @Expose()
  public imagePreview?: string;

  @Expose()
  public imagesGallery?: string[];

  @Expose()
  @Transform(({value}) => Number(Number.parseFloat(value).toFixed(1)))
  public rating?: number;

  @Expose()
  public suggestionType?: SuggestionType;

  @Expose()
  public roomsCount?: number;

  @Expose()
  public guestCount?: number;

  @Expose()
  public rentPrice?: number;

  @Expose()
  public conveniences?: ConvenienceType[];

  @Expose()
  @Type(() => CoordinatesRdo)
  public coordinates?: CoordinatesRdo;

  @Expose()
  @Type(() => UserRdo)
  public author?: UserRdo;

  @Expose()
  public favourite?: boolean;

  @Expose()
  public premium?: boolean;

  @Expose()
  public commentsCount?: number;
}
