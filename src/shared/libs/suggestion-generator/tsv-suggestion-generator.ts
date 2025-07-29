import {SuggestionGenerator} from './suggestion-generator.interface.js';
import {MockServerData} from '../../types/index.js';
import {generateRandomNumber, getRandomItem, getRandomItems} from '../../helpers/index.js';
import dayjs from 'dayjs';
import {SuggestionGeneratorConstants} from '../../enums/index.js';

const FLAGS = [true, false];

export class TSVSuggestionGenerator implements SuggestionGenerator {
  constructor(private readonly mockData: MockServerData) {
  }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities);
    const suggestionType = getRandomItem<string>(this.mockData.suggestionTypes);
    const imagePreview = getRandomItem<string>(this.mockData.imagePreviews);
    const imagesGallery = getRandomItems<string>(this.mockData.imagesGallery).join(';');
    const premium = getRandomItem<boolean>(FLAGS);
    const favourite = getRandomItem<boolean>(FLAGS);
    const rating = generateRandomNumber(SuggestionGeneratorConstants.MIN_VALUE, SuggestionGeneratorConstants.MAX_RATING);
    const roomsCount = generateRandomNumber(SuggestionGeneratorConstants.MIN_VALUE, SuggestionGeneratorConstants.MAX_ROOMS);
    const guestsCount = generateRandomNumber(SuggestionGeneratorConstants.MIN_VALUE, SuggestionGeneratorConstants.MAX_GUESTS);
    const rentPrice = generateRandomNumber(SuggestionGeneratorConstants.MIN_PRICE, SuggestionGeneratorConstants.MAX_PRICE);
    const conveniences = getRandomItems<string>(this.mockData.conveniences).join(';');
    const author = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const commentsCount = generateRandomNumber(1, 500);
    const coordinates = getRandomItem(this.mockData.coordinates);

    const createdDate = dayjs()
      .subtract(generateRandomNumber(SuggestionGeneratorConstants.MIN_VALUE, SuggestionGeneratorConstants.LAST_WEEK_DAY), 'day')
      .toISOString();

    const [firstName, lastName] = author.split(' ');

    const [latitude, longitude] = coordinates.split(',');

    return [
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
    ].join('\t');
  }
}
