import {Expose, Transform} from 'class-transformer';

export class CoordinatesRdo {
  @Expose({name: '_id'})
  @Transform(({value}) => value.toString())
  public id: string;

  @Expose()
  public longitude: number;

  @Expose()
  public latitude: number;
}
