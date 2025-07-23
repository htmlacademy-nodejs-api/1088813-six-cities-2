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
  ] = suggestionData.replace('\n', '').split('\t');

  const user = {
    email,
    firstName,
    lastName,
    avatar,
  };

  return {
    title,
    description,
    publishedDate: createdDate,
    city,
    imagePreview,
    imagesGallery: imagesGallery.split(';'),
    premium: Boolean(premium),
    favourite: Boolean(favourite),
    rating: Number.parseInt(rating, 10),
    suggestionType: suggestionType as SuggestionType,
    roomsCount: Number.parseInt(roomsCount, 10),
    guestCount: Number.parseInt(guestsCount, 10),
    rentPrice: Number.parseInt(rentPrice, 10),
    conveniences: conveniences.split(';').map((convenience) => convenience as ConvenienceType),
    author: user,
    commentCount: Number.parseInt(commentsCount, 10),
  };
}
