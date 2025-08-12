import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {ConvenienceType, SuggestionType} from '../../enums/index.js';
import {UserEntity} from '../user/index.js';
import {CoordinatesEntity} from '../coordinates/coordinates.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface SuggestionEntity extends defaultClasses.Base {}


@modelOptions({
  schemaOptions: {
    collection: 'suggestions',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class SuggestionEntity extends defaultClasses.TimeStamps {
  @prop({required: true, default: null, trim: true})
  public title: string;

  @prop({required: true, default: null, trim: true})
  public description: string;

  @prop({required: true, default: null})
  public publishedDate: Date;

  @prop({required: true, default: null})
  public city: string;

  @prop({required: true, default: null})
  public imagePreview: string;

  @prop({required: true, limit: 6})
  public imagesGallery: string[];

  @prop({required: true, default: null})
  public premium: boolean;

  @prop({required: true, default: false})
  public favourite: boolean;

  @prop({required: true, default: null, type: () => String, enum: SuggestionType})
  public suggestionType: SuggestionType;

  @prop({required: true, default: null})
  public roomsCount: number;

  @prop({required: true, default: null})
  public guestCount: number;

  @prop({required: true, default: null})
  public rentPrice: number;

  @prop({required: true, default: []})
  public conveniences: ConvenienceType[];

  @prop({default: 0})
  public commentCount: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public authorId: Ref<UserEntity>;

  @prop({required: true, type: CoordinatesEntity})
  public coordinates!: CoordinatesEntity;
}

export const SuggestionModel = getModelForClass(SuggestionEntity);
