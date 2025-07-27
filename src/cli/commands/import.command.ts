import {Command} from './command.interface.js';
import {TsvFileReader} from '../../shared/libs/file-reader/tsv-file-reader.js';
import chalk from 'chalk';
import {getErrorMessage, createSuggestion} from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const suggestion = createSuggestion(line);
    console.info(suggestion);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [fileName] = parameters;
    const fileReader = new TsvFileReader(fileName.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`${chalk.redBright('Can\'t import data from file:')} ${chalk.whiteBright(fileName)}`);
      console.error(getErrorMessage(error));
    }
  }
}
