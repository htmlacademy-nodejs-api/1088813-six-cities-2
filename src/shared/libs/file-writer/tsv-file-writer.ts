import {FileWriter} from './file-writer.interface.js';
import {createWriteStream, WriteStream} from 'node:fs';


export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(fileName: string) {
    this.stream = createWriteStream(fileName, {
      flags: 'w',
      encoding: 'utf8',
      autoClose: true,
    });
  }

  public async write(row: string): Promise<unknown> {
    const writeSuccess = this.stream.write(`${row}\n`);

    if (!writeSuccess) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve(true));
      });
    }

    return Promise.resolve();
  }
}
