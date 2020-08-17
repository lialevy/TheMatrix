import { Player } from '.';
import { Results } from '../services/game-service.interface';
import Strategy from './Strategy.class';
import Game, { GameType } from './Game.class';

export interface ThreePlayerMatrix {
  playersStrategies?: string[][];
  paymentsMatrix?: {
    [firstStrategy: string]: {
      [secondStrategy: string]: {
        [thirdStrategy: string]: [number, number, number];
      };
    };
  };
}

export default class ThreePlayerGame extends Game {
  #player3PossibleStrategies = '01234567890αβγ'.split('');

  protected currentPlayerStrategies: [Strategy, Strategy, Strategy] = [
    undefined,
    undefined,
    undefined,
  ];

  matrix: ThreePlayerMatrix;

  constructor(matrix?: ThreePlayerMatrix, numberOfRounds: number = 1) {
    super();

    this.createPlayers();

    this.matrix = matrix
      ? matrix
      : {
          playersStrategies: undefined,
          paymentsMatrix: undefined,
        };

    this.numberOfRounds = numberOfRounds;
    this.rounds = [];
  }

  createPlayers(): void {
    super.createPlayers(3);
  }

  createGameMatrix(rows: number, columns: number, depth: number): ThreePlayerMatrix {
    const firstPlayerStrategies: string[] = [];
    const secondPlayerStrategies: string[] = [];
    const thirdPlayerStrategies: string[] = [];
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
          paymentsMatrix[firstPlayerStrategy][strategyName] = {};
        }
      }
    }

    for (let depthIndex = 0; depthIndex < depth; depthIndex++) {
      const strategyName = this.#player3PossibleStrategies[depthIndex];
      thirdPlayerStrategies.push(strategyName);

      for (const firstPlayerStrategy in paymentsMatrix) {
        if (Object.prototype.hasOwnProperty.call(paymentsMatrix, firstPlayerStrategy)) {
          for (const secondPlayerStrategy in paymentsMatrix[firstPlayerStrategy]) {
            if (Object.prototype.hasOwnProperty.call(paymentsMatrix[firstPlayerStrategy], secondPlayerStrategy)) {
              paymentsMatrix[firstPlayerStrategy][secondPlayerStrategy][strategyName] = [];
            }
          }
        }
      }
    }

    this.matrix = {
      playersStrategies: [firstPlayerStrategies, secondPlayerStrategies, thirdPlayerStrategies],
      paymentsMatrix
    };

    return this.matrix;
  }

  generateRandomMatrixValues(type: GameType = GameType.Normal, minValue: number = 0, maxValue: number = 10): ThreePlayerMatrix {
    if (type === GameType.ZeroSum) {
      throw new Error('Three player game cannot be ZeroSum');
    }

    for (const firstPlayerStrategy of this.matrix.playersStrategies[0]) {
      for (const secondPlayerStrategy of this.matrix.playersStrategies[1]) {
        for (const thirdPlayerStrategy of this.matrix.playersStrategies[2]) {
          const firstPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
          const secondPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
          const thirdPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);

          this.matrix.paymentsMatrix
            [firstPlayerStrategy]
            [secondPlayerStrategy]
            [thirdPlayerStrategy] = [firstPlayerPayoff, secondPlayerPayoff, thirdPlayerPayoff];
        }
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

    if (this.players.length !== 3) {
      errors.push('Not enough players in game');
    }

    return [(errors.length > 0), errors];
  }

  submitPlayerStrategy(playerIndex: number, strategy: string): void {
    super.submitPlayerStrategy(playerIndex, strategy);

    if (
      this.currentPlayerStrategies[0] !== undefined &&
      this.currentPlayerStrategies[1] !== undefined &&
      this.currentPlayerStrategies[2] !== undefined
    ) {
      const [s1, s2, s3] = this.currentPlayerStrategies;
      const roundResult = this.matrix.paymentsMatrix[s1.strategy][s2.strategy][s3.strategy];

      super.finishRound(roundResult);
    }
  }

  getGameResults(): Results {
    let scoreTable;

    const mostCookies =
      this.players.map(p => p.cookies).reduce((maxCookies, currentCookies) => maxCookies >= currentCookies ? maxCookies : currentCookies);

    const firstPlace = this.players.filter(p => p.cookies === mostCookies);

    if (firstPlace.length === 3) {
      scoreTable = this.players.map(p => ({ ...p, place: 1 }));
    } else if (firstPlace.length === 2) {
      const secondPlace = this.players.find(p => p.cookies !== mostCookies);
      scoreTable = this.players.map(p =>
        p.playerNumber !== secondPlace.playerNumber ?
        { ...p, place: 1} : { ...p, place: 2});
    } else {
      const otherPlayers: (Player & { place?: 1 | 2 | 3 })[] = this.players.filter(p => p.playerNumber !== firstPlace[0].playerNumber);

      if (otherPlayers[0].cookies === otherPlayers[1].cookies) {
        otherPlayers[0].place = 2;
        otherPlayers[1].place = 2;
      } else if (otherPlayers[0].cookies > otherPlayers[1].cookies) {
        otherPlayers[0].place = 2;
        otherPlayers[1].place = 3;
      } else {
        otherPlayers[1].place = 2;
        otherPlayers[0].place = 3;
      }

      scoreTable = [
        {...firstPlace[0], place: 1},
        ...otherPlayers
      ];
    }

    return {
      scoreTable,
      roundsTable: this.rounds
    };
  }
}
