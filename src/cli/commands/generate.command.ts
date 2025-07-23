import {Command} from './command.interface.js';
import {MockServerData} from '../../shared/types/index.js';
import got from 'got';
import chalk from 'chalk';
import {TSVSuggestionGenerator} from '../../shared/libs/suggestion-generator/index.js';
import {TSVFileWriter} from '../../shared/libs/file-writer/tsv-file-writer.js';
import {getErrorMessage} from '../../shared/helpers/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filePath: string, suggestionCount: number) {
    const tsvSuggestionGenerator = new TSVSuggestionGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filePath);

    for (let i = 0; i < suggestionCount; i++) {
      await tsvFileWriter.write(tsvSuggestionGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filePath, url] = parameters;
    const suggestionCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filePath, suggestionCount);
      console.info(chalk.yellowBright.bold(`File ${filePath} was created!`));
    } catch (error: unknown) {
      console.error(chalk.redBright.bold('Can\'t generate data'));

      getErrorMessage(error);
    }
  }
}
