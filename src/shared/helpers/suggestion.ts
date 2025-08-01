import {ConvenienceType, SuggestionType} from '../enums/index.js';

export function createSuggestion(suggestionData: string) {
  const [
    title,
    description,
    createdDate,
    city,
    suggestionType,
    imagePreview,
    imagesGallery,
    premium,
    favourite,
    rating,
    roomsCount,
    guestsCount,
    rentPrice,
    conveniences,
    firstName,
    lastName,
    email,
    avatar,
    commentsCount,
    latitude,
    longitude,
  ] = suggestionData.replace('\n', '').split('\t');

  const user = {
    email,
    firstName,
    lastName,
    avatar,
  };

  const coordinates = {
    latitude: Number.parseFloat(latitude),
    longitude: Number.parseFloat(longitude),
  };

  return {
    title,
    description,
    publishedDate: new Date(createdDate),
    city,
    imagePreview,
    imagesGallery: imagesGallery.split(';'),
    premium: premium === 'true',
    favourite: favourite === 'true',
    rating: Number.parseInt(rating, 10),
    suggestionType: suggestionType as SuggestionType,
    roomsCount: Number.parseInt(roomsCount, 10),
    guestCount: Number.parseInt(guestsCount, 10),
    rentPrice: Number.parseInt(rentPrice, 10),
    conveniences: conveniences.split(';').map((convenience) => convenience as ConvenienceType),
    author: user,
    commentCount: Number.parseInt(commentsCount, 10),
    coordinates,
  };
}
