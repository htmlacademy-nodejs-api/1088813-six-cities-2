import {IsNumber, Max, Min} from 'class-validator';
import {CreateCoordinatesMessages} from './create-coordinates.messages.js';

export class CoordinatesDto {
  @IsNumber({}, { message: CreateCoordinatesMessages.latitude.invalidType })
  @Min(-90, { message: CreateCoordinatesMessages.latitude.min })
  @Max(90, { message: CreateCoordinatesMessages.latitude.max })
  public latitude: number;

  @IsNumber({}, { message: CreateCoordinatesMessages.longitude.invalidType })
  @Min(-180, { message: CreateCoordinatesMessages.longitude.min })
  @Max(180, { message: CreateCoordinatesMessages.longitude.max })
  public longitude: number;
}
