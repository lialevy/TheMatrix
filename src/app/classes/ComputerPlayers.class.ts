import { uniqueNamesGenerator, starWars} from 'unique-names-generator';
import Player from './Player.class';
import PlayerType from './PlayerType.enum';

export default class ComputerPlayer extends Player {
  playerNumber: 0 | 1 | 2;
  name?: string;
  cookies: number;
  type = undefined;

  constructor(playerNumber: 0 | 1 | 2, name?: string, cookies: number = 0) {
    super(playerNumber, name, cookies);

    this.name = uniqueNamesGenerator({ dictionaries: [starWars], length: 1 });
  }

  play(): void {}
}

export class RandomComputerPlayer extends ComputerPlayer {
  type = PlayerType.Random;

  constructor(playerNumber: 0 | 1 | 2, name?: string, cookies: number = 0) {
    super(playerNumber, name, cookies);
  }

  play(): void {}
}

export class MaxMinComputerPlayer extends ComputerPlayer {
  type = PlayerType.MaxMin;

  constructor(playerNumber: 0 | 1 | 2, name?: string, cookies: number = 0) {
    super(playerNumber, name, cookies);
  }

  play(): void {}
}
