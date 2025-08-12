import {Ref, defaultClasses, modelOptions, prop, getModelForClass} from '@typegoose/typegoose';
import {UserEntity} from '../user/index.js';
import {SuggestionEntity} from '../suggestion/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true, trim: true})
  public text!: string;

  @prop({required: true, ref: UserEntity})
  public authorId!: Ref<UserEntity>;

  @prop({required: true, ref: SuggestionEntity})
  public suggestionId!: Ref<SuggestionEntity>;

  @prop({required: true})
  public rating: number;
}

export const CommentModel = getModelForClass(CommentEntity);
