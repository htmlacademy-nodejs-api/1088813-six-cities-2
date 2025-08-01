import {DatabaseClient} from './database-client.interface.js';
import {inject, injectable} from 'inversify';
import * as Mongoose from 'mongoose';
import {Component} from '../../consts/index.js';
import {Logger} from '../logger/index.js';
import {DatabaseConnectionValues} from '../../enums/index.js';
import {setTimeout} from 'node:timers/promises';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean = false;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {}

  public isConnectingToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectingToDatabase()) {
      throw new Error('MongoDB client is already connected.');
    }

    this.logger.info('Trying to connect to MongoDB...');


    let attempt = 0;
    while (attempt < DatabaseConnectionValues.RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(DatabaseConnectionValues.RETRY_TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${DatabaseConnectionValues.RETRY_COUNT}`);
  }

  public async disconnect() {
    if (!this.isConnectingToDatabase()) {
      throw new Error('Not connected to the database.');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
