import {ConvenienceType, SuggestionType} from '../enums/rent-suggestion.js';
import {User} from './user.js';

export type RentSuggestion = {
  title: string;
  description: string;
  publishedDate: Date;
  city: string;
  imagePreview: string;
  imagesGallery: string[];
  premium: boolean;
  favourite: boolean;
  rating: number;
  suggestionType: SuggestionType;
  roomsCount: number;
  guestCount: number;
  rentPrice: number;
  conveniences: ConvenienceType[];
  author: User;
  commentCount?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
