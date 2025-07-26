import {Config} from './config.interface.js';
import {Logger} from '../logger/index.js';
import {config, DotenvParseOutput} from 'dotenv';
import {inject, injectable} from 'inversify';
import {Component} from '../../consts/index.js';

@injectable()
export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env file found and successfully parsed!');
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
