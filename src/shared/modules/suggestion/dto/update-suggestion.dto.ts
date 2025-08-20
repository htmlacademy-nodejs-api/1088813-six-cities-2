import {ConvenienceType, SuggestionType} from '../../../enums/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize, IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional, Max,
  MaxLength, Min,
  MinLength, ValidateNested
} from 'class-validator';
import {CreateSuggestionValidationMessage} from './create-suggestion.messages.js';
import {Type} from 'class-transformer';
import {CoordinatesDto} from '../../coordinates/index.js';

export class UpdateSuggestionDto {
  @IsOptional()
  @MinLength(10, { message: CreateSuggestionValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateSuggestionValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: CreateSuggestionValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateSuggestionValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsNotEmpty({ message: CreateSuggestionValidationMessage.city.isNotEmpty })
  @IsIn(['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'], {
    message: CreateSuggestionValidationMessage.city.invalidFormat,
  })
  public city?: string;

  @IsOptional()
  @IsNotEmpty({ message: CreateSuggestionValidationMessage.imagePreview.isNotEmpty })
  @MaxLength(256, { message: CreateSuggestionValidationMessage.imagePreview.maxLength })
  public imagePreview?: string;

  @IsOptional()
  @IsNotEmpty({ each: true, message: CreateSuggestionValidationMessage.imagesGallery.isNotEmpty })
  @ArrayMaxSize(6, { message: CreateSuggestionValidationMessage.imagesGallery.max})
  @ArrayMinSize(6, { message: CreateSuggestionValidationMessage.imagesGallery.min})
  @MaxLength(256, { each: true, message: CreateSuggestionValidationMessage.imagesGallery.maxLength })
  public imagesGallery?: string[];

  @IsOptional()
  @IsNotEmpty({ message: CreateSuggestionValidationMessage.suggestionType.isNotEmpty })
  @IsEnum(SuggestionType, { message: CreateSuggestionValidationMessage.suggestionType.invalid })
  public suggestionType?: SuggestionType;

  @IsOptional()
  @IsInt({ message: CreateSuggestionValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateSuggestionValidationMessage.roomsCount.minValue })
  @Max(8, { message: CreateSuggestionValidationMessage.roomsCount.maxValue })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateSuggestionValidationMessage.guestCount.invalidFormat })
  @Min(1, { message: CreateSuggestionValidationMessage.guestCount.minValue })
  @Max(10, { message: CreateSuggestionValidationMessage.guestCount.maxValue })
  public guestCount?: number;

  @IsOptional()
  @IsInt({ message: CreateSuggestionValidationMessage.rentPrice.invalidFormat })
  @Min(100, { message: CreateSuggestionValidationMessage.rentPrice.minValue })
  @Max(100000, { message: CreateSuggestionValidationMessage.rentPrice.maxValue })
  public rentPrice?: number;

  @IsOptional()
  @IsArray({message: CreateSuggestionValidationMessage.conveniences.invalidFormat })
  @IsEnum(ConvenienceType, { each: true, message: CreateSuggestionValidationMessage.conveniences.invalid })
  public conveniences?: ConvenienceType[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates?: CoordinatesDto;
}
