import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';

export function getCurrentModuleDirectoryPath() {
  const filePath = fileURLToPath(import.meta.url);
  return dirname(filePath);
}
