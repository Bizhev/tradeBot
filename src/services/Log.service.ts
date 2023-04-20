import { format } from 'date-fns';

export abstract class LogService {
  name = 'unknown';
  constructor(name: string) {
    if (name) {
      this.name = name;
    }
  }
  log(msg: string) {
    console.log(
      `[INFO][${this.name}] ${format(
        new Date(),
        'dd.MM.yyyy, HH:mm:ss',
      )} - ${msg}`,
    );
  }
  error(msg: string) {
    console.error(
      `[ERROR][${this.name}] ${format(
        new Date(),
        'dd.MM.yyyy, HH:mm:ss',
      )} - ${msg}`,
    );
  }
  warn(msg: string) {
    console.warn(
      `[WARN] [${this.name}] ${format(
        new Date(),
        'dd.MM.yyyy, HH:mm:ss',
      )} - ${msg}`,
    );
  }
}
