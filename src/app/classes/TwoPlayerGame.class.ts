import Player from './Player.class';
import Round from './Round.class';
import Game from './Game.class';

export interface TwoPlayerMatrix {
  playersStrategies?: string[][];
  paymentsMatrix?: {
    [firstStrategy: string]: {
      [secondStrategy: string]: [number, number];
    };
  };
}

export default class TwoPlayerGame extends Game {
  players: Player[];
  matrix: TwoPlayerMatrix;
  numberOfRounds: number;
  rounds: Round[];

  constructor(
    players?: [Player, Player],
    matrix?: TwoPlayerMatrix,
    numberOfRounds: number = 1
  ) {
    super();

    this.matrix = matrix ? matrix : {
      playersStrategies: undefined,
      paymentsMatrix: undefined
    };

    this.numberOfRounds = numberOfRounds;
  }

  createPlayers(): void {
    super.createPlayers(2);
  }
}
