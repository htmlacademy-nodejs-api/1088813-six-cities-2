import {Command} from './command.interface.js';
import {TsvFileReader} from '../../shared/libs/file-reader/tsv-file-reader.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [fileName] = parameters;
    const fileReader = new TsvFileReader(fileName.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`${chalk.redBright('Can\'t import data from file:')} ${chalk.whiteBright(fileName)}`);
      console.error(`${chalk.bgRedBright.whiteBright('Details:')} ${chalk.bold.whiteBright(error.message)}`);
    }
  }
}
