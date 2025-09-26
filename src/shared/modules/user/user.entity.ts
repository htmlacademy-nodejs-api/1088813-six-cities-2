import {User} from '../../types/index.js';
import {defaultClasses, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';
import {createSHA256} from '../../helpers/index.js';
import {UserType} from '../../enums/index.js';
import {SuggestionEntity} from '../suggestion/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}


@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({unique: true, required: true})
  public email: string;

  @prop({required: true, default: ''})
  public firstName: string;

  @prop({required: true, default: ''})
  public lastName: string;

  @prop({ default: ''})
  public avatar?: string;

  @prop({required: true, default: ''})
  public password: string;

  @prop({ default: UserType.DEFAULT})
  public type?: UserType;

  @prop({ required: true, default: []})
  public favouriteSuggestions: SuggestionEntity[];

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);

    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
