import {ClassConstructor, plainToInstance} from 'class-transformer';
import {Error} from 'mongoose';
import {ValidationError} from 'class-validator';
import {ApplicationError, ValidationErrorField} from '../libs/rest/index.js';

export function generateRandomNumber(min: number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomNumber(0, items.length - 1);
  const endPosition = startPosition + generateRandomNumber(startPosition, items.length);

  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomNumber(0, items.length - 1)];
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return {
    errorType,
    error,
    details,
  };
}

export function parseNumberPartialFromString(string?: string) {
  return string ? Number.parseInt(string, 10) : undefined;
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
