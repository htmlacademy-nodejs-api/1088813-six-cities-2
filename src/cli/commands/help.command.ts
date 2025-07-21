import {Command} from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.hex('#299195FF').bold('Программа для подготовки данных для REST API сервера.')}
        ${chalk.bgYellowBright.whiteBright('Пример:')}
            ${chalk.bgCyan.whiteBright('cli.js --<command> [--arguments]')}
        ${chalk.bgYellowBright.whiteBright('Команды:')}
            ${chalk.bgCyan.whiteBright('--version:')}                   ${chalk.gray('# выводит номер версии')}
            ${chalk.bgCyan.whiteBright('--help:')}                      ${chalk.gray('# печатает этот текст')}
            ${chalk.bgCyan.whiteBright('--import <path>:')}             ${chalk.gray('# импортирует данные из TSV')}
            ${chalk.bgCyan.whiteBright('--generate <n> <path> <url>')}  ${chalk.gray('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
