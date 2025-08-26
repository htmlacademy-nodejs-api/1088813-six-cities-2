import {ConvenienceType, SuggestionType} from '../../../enums/index.js';
import {
  IsDateString,
  MaxLength,
  MinLength,
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty, IsEnum, IsInt, Min, Max, IsArray, ValidateNested, IsIn
} from 'class-validator';
import {CreateSuggestionValidationMessage} from './create-suggestion.messages.js';
import {CoordinatesDto} from '../../coordinates/index.js';
import {Type} from 'class-transformer';

export class CreateSuggestionDto {
  @MinLength(10, { message: CreateSuggestionValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateSuggestionValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateSuggestionValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateSuggestionValidationMessage.description.maxLength })
  public description: string;

  @IsNotEmpty({ message: CreateSuggestionValidationMessage.publishedDate.isNotEmpty })
  @IsDateString({}, { message: CreateSuggestionValidationMessage.publishedDate.invalidFormat })
  public publishedDate: Date;

  @IsNotEmpty({ message: CreateSuggestionValidationMessage.city.isNotEmpty })
  @IsIn(['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'], {
    message: CreateSuggestionValidationMessage.city.invalidFormat,
  })
  public city: string;

  @IsNotEmpty({ message: CreateSuggestionValidationMessage.imagePreview.isNotEmpty })
  @MaxLength(256, { message: CreateSuggestionValidationMessage.imagePreview.maxLength })
  public imagePreview: string;

  @IsNotEmpty({ each: true, message: CreateSuggestionValidationMessage.imagesGallery.isNotEmpty })
  @ArrayMaxSize(6, { message: CreateSuggestionValidationMessage.imagesGallery.max})
  @ArrayMinSize(6, { message: CreateSuggestionValidationMessage.imagesGallery.min})
  @MaxLength(256, { each: true, message: CreateSuggestionValidationMessage.imagesGallery.maxLength })
  public imagesGallery: string[];

  @IsNotEmpty({ message: CreateSuggestionValidationMessage.suggestionType.isNotEmpty })
  @IsEnum(SuggestionType, { message: CreateSuggestionValidationMessage.suggestionType.invalid })
  public suggestionType: SuggestionType;

  @IsInt({ message: CreateSuggestionValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateSuggestionValidationMessage.roomsCount.minValue })
  @Max(8, { message: CreateSuggestionValidationMessage.roomsCount.maxValue })
  public roomsCount: number;

  @IsInt({ message: CreateSuggestionValidationMessage.guestCount.invalidFormat })
  @Min(1, { message: CreateSuggestionValidationMessage.guestCount.minValue })
  @Max(10, { message: CreateSuggestionValidationMessage.guestCount.maxValue })
  public guestCount: number;

  @IsInt({ message: CreateSuggestionValidationMessage.rentPrice.invalidFormat })
  @Min(100, { message: CreateSuggestionValidationMessage.rentPrice.minValue })
  @Max(100000, { message: CreateSuggestionValidationMessage.rentPrice.maxValue })
  public rentPrice: number;

  @IsArray({message: CreateSuggestionValidationMessage.conveniences.invalidFormat })
  @IsEnum(ConvenienceType, { each: true, message: CreateSuggestionValidationMessage.conveniences.invalid })
  public conveniences: ConvenienceType[];

  public authorId: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates: CoordinatesDto;
}
