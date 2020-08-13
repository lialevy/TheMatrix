import { uniqueNamesGenerator, animals} from 'unique-names-generator';

export default class Player {
  playerNumber: 0 | 1 | 2;
  name?: string;
  cookies: number;

  constructor(playerNumber: 0 | 1 | 2, name?: string, cookies: number = 0) {
    this.playerNumber = playerNumber;
    this.name = uniqueNamesGenerator({ dictionaries: [animals], length: 1 });
    this.cookies = cookies;
  }
}
