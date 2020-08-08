import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, names} from 'unique-names-generator';

export default class Player {
  id: string; // uuid
  name?: string;
  cookies: number;

  constructor(name?: string, cookies: number = 0) {
    this.id = uuidv4();
    this.name = uniqueNamesGenerator({ dictionaries: [names] });
    this.cookies = cookies;
  }
}
