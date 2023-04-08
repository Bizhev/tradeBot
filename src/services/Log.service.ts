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
      `[${this.name}] ${format(new Date(), 'dd.MM.yyyy, HH:mm:ss')} - ${msg}`,
    );
  }
}
