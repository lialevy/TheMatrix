import Player from './Player.class';
import Round from './Round.class';
import Game from './Game.class';
import { Results, Strategy } from '../services/game-service.interface';

export interface TwoPlayerMatrix {
  playersStrategies?: string[][];
  paymentsMatrix?: {
    [firstStrategy: string]: {
      [secondStrategy: string]: [number, number];
    };
  };
}

export default class TwoPlayerGame extends Game {
  matrix: TwoPlayerMatrix;

  protected currentPlayerStrategies: [Strategy, Strategy] = [
    undefined,
    undefined,
  ];

  constructor(
    matrix?: TwoPlayerMatrix,
    numberOfRounds: number = 1
  ) {
    super();

    this.createPlayers();

    this.matrix = matrix ? matrix : {
      playersStrategies: undefined,
      paymentsMatrix: undefined
    };

    this.numberOfRounds = numberOfRounds;
    this.rounds = [];
  }

  createPlayers(): void {
    super.createPlayers(2);
  }

  createGameMatrix(rows: number, columns: number, _: number): TwoPlayerMatrix {
    const firstPlayerStrategies: string[] = [];
    const secondPlayerStrategies: string[] = [];
    const paymentsMatrix = {};

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const strategyName = this.player1PossibleStrategies[rowIndex];
      firstPlayerStrategies.push(strategyName);
      paymentsMatrix[strategyName] = {};
    }

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      const strategyName = this.player2PossibleStrategies[columnIndex];
      secondPlayerStrategies.push(strategyName);

      for (const firstPlayerStrategy in paymentsMatrix) {
        if (Object.prototype.hasOwnProperty.call(paymentsMatrix, firstPlayerStrategy)) {
          paymentsMatrix[firstPlayerStrategy][strategyName] = [];
        }
      }
    }

    this.matrix = {
      playersStrategies: [firstPlayerStrategies, secondPlayerStrategies],
      paymentsMatrix
    };

    return this.matrix;
  }

  generateRandomMatrixValues(minValue: number = 0, maxValue: number = 10): TwoPlayerMatrix {
    for (const firstPlayerStrategy of this.matrix.playersStrategies[0]) {
      for (const secondPlayerStrategy of this.matrix.playersStrategies[1]) {
        const firstPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
        const secondPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
        this.matrix.paymentsMatrix[firstPlayerStrategy][secondPlayerStrategy] = [firstPlayerPayoff, secondPlayerPayoff];
      }
    }

    return this.matrix;
  }

  finalizeGameSetup(): void {
    if (!this.players || this.players.length === 0) {
      this.createPlayers();
    }
  }

  validateGame(): [boolean, string[]] {
    const [, errors] = super.validateGame();

    if (this.players.length !== 2) {
      errors.push('Not enough players in game');
    }

    return [(errors.length > 0), errors];
  }

  submitPlayerStrategy(playerIndex: number, strategy: string): void {
    super.submitPlayerStrategy(playerIndex, strategy);

    if (
      this.currentPlayerStrategies[0] !== undefined &&
      this.currentPlayerStrategies[1] !== undefined
    ) {
      const [s1, s2] = this.currentPlayerStrategies;
      const roundResult = this.matrix.paymentsMatrix[s1.strategy][s2.strategy];

      super.finishRound(roundResult);
    }
  }

  getGameResults(): Results {
    const [firstPlayer, secondPlayer]: (Player & { place?: 1 | 2 | 3 })[] = this.players;

    if (firstPlayer.cookies === secondPlayer.cookies) {
      firstPlayer.place = 1;
      secondPlayer.place = 1;
    } else if (firstPlayer.cookies > secondPlayer.cookies) {
      firstPlayer.place = 1;
      secondPlayer.place = 2;
    } else {
      secondPlayer.place = 1;
      firstPlayer.place = 2;
    }

    return {
      scoreTable: [firstPlayer, secondPlayer],
      roundsTable: this.rounds
    };
  }
}
