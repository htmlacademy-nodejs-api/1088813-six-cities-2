import {ConvenienceType, SuggestionType} from '../../../enums/index.js';

export const CreateSuggestionValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  publishedDate: {
    invalidFormat: 'postDate must be a valid ISO date',
    isNotEmpty: 'Required field',
  },
  city: {
    invalidFormat: 'Must be a contains [Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf]',
    isNotEmpty: 'Required field',
  },
  imagePreview: {
    maxLength: 'Too short for field «imagePreview»',
    isNotEmpty: 'Required field',
  },
  imagesGallery: {
    min: 'min images 6',
    max: 'max images 6',
    isNotEmpty: 'Required field',
    maxLength: 'Too short for field «imagesGallery» element',
  },
  suggestionType: {
    invalid: `type must be ${Object.values(SuggestionType).join(', ')}`,
    isNotEmpty: 'Required field',
  },
  rentPrice: {
    invalidFormat: 'rentPrice must be an integer',
    minValue: 'Minimum rentPrice is 100',
    maxValue: 'Maximum rentPrice is 100000',
  },
  roomsCount: {
    invalidFormat: 'roomsCount must be an integer',
    minValue: 'Minimum roomsCount is 1',
    maxValue: 'Maximum roomsCount is 8',
  },
  guestCount: {
    invalidFormat: 'guestCount must be an integer',
    minValue: 'Minimum guestCount is 1',
    maxValue: 'Maximum guestCount is 10',
  },
  conveniences: {
    invalidFormat: 'Field categories must be an array',
    invalid: `conveniences field must be an array of ${JSON.stringify(ConvenienceType)}`,
  },
  authorId: {
    invalidId: 'authorId field must be a valid id',
  },
} as const;
