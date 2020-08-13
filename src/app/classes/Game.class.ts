import Player from './Player.class';
import Round from './Round.class';

export default abstract class Game {
  players: Player[];
  matrix: any;
  numberOfRounds: number;
  rounds: Round[];

  constructor() {

  }

  createPlayers(numberOfPlayers): void {
    this.players = [];

    for (let playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
      this.players.push(new Player(playerIndex as 0 | 1 | 2));
    }
  }
}
