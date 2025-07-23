import {SuggestionGenerator} from './suggestion-generator.interface.js';
import {MockServerData} from '../../types/index.js';
import {generateRandomNumber, getRandomItem, getRandomItems} from '../../helpers/index.js';
import dayjs from 'dayjs';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 8;

const MIN_RATING = 1;
const MAX_RATING = 5;

const FLAGS = [true, false];

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

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
    const rating = generateRandomNumber(MIN_RATING, MAX_RATING);
    const roomsCount = generateRandomNumber(MIN_ROOMS, MAX_ROOMS);
    const guestsCount = generateRandomNumber(MIN_GUESTS, MAX_GUESTS);
    const rentPrice = generateRandomNumber(MIN_PRICE, MAX_PRICE);
    const conveniences = getRandomItems<string>(this.mockData.conveniences).join(';');
    const author = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const commentsCount = generateRandomNumber(1, 500);

    const createdDate = dayjs()
      .subtract(generateRandomNumber(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const [firstName, lastName] = author.split(' ');

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
    ].join('\t');
  }
}
