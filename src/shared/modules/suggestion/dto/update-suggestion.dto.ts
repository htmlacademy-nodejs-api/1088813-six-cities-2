import {ConvenienceType, SuggestionType} from '../../../enums/index.js';

export class UpdateSuggestionDto {
  public title?: string;
  public description?: string;
  public city?: string;
  public imagePreview?: string;
  public imagesGallery?: string[];
  public rating?: number;
  public suggestionType?: SuggestionType;
  public roomsCount?: number;
  public guestCount?: number;
  public rentPrice?: number;
  public conveniences?: ConvenienceType[];
  public coordinates?: {
    latitude?: number;
    longitude?: number;
  };
}
