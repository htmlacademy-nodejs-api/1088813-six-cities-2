#!/usr/bin/env node
/* eslint-disable node/no-unsupported-features/es-syntax */
import 'reflect-metadata';
import {CLIApplication} from './cli/index.js';
import {glob} from 'glob';
import {Command} from './cli/commands/command.interface.js';
import {resolve} from 'node:path';

async function bootstrap() {
  const cliApplication = new CLIApplication();

  const importedCommands: Command[] = [];
  const files = glob.sync('src/cli/commands/*.command.ts');

  for (const file of files) {
    const modulePath = resolve(file);
    const CommandClass = await import(modulePath);

    for (const exportKey of Object.keys(CommandClass)) {
      const ExportClass = CommandClass[exportKey];
      if (ExportClass.prototype && typeof ExportClass.prototype.execute === 'function') {
        const commandInstance = new ExportClass();
        importedCommands.push(commandInstance);
      }
    }
  }

  cliApplication.registerCommands(importedCommands);

  cliApplication.processCommand(process.argv);
}

bootstrap();
