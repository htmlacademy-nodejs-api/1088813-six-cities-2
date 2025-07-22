import {FileReader} from './file-reader.interface.js';
import {readFileSync} from 'node:fs';
import {RentSuggestion} from '../../types/index.js';
import {ConvenienceType, SuggestionType} from '../../enums/index.js';

export class TsvFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly fileName: string) {
  }

  public read(): void {
    this.rawData = readFileSync(this.fileName, {encoding: 'utf8'});
  }

  public toArray(): RentSuggestion[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([
        title,
        description,
        publishedDate,
        city,
        imagePreview,
        imagesGallery,
        premium,
        favourite,
        rating,
        suggestionType,
        roomsCount,
        guestCount,
        rentPrice,
        conveniences,
        name,
        email,
        avatar,
        commentCount,
      ]) => ({
        title,
        description,
        publishedDate: new Date(publishedDate),
        city,
        imagePreview,
        imagesGallery: imagesGallery.split(';'),
        premium: Boolean(premium),
        favourite: Boolean(favourite),
        rating: Number.parseInt(rating, 10),
        suggestionType: suggestionType as SuggestionType,
        roomsCount: Number.parseInt(roomsCount, 10),
        guestCount: Number.parseInt(guestCount, 10),
        rentPrice: Number.parseInt(rentPrice, 10),
        conveniences: conveniences.split(';').map((convenience) => convenience as ConvenienceType),
        author: {name, email, avatar},
        commentCount: Number.parseInt(commentCount, 10),
      }));
  }
}
