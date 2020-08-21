import Player from './Player.class';
import Game, { GameType } from './Game.class';
import Strategy from './Strategy.class';
import { Results } from '../services/game-service.interface';
import { MixedStrategy } from '.';

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
        if (Object.prototype.hasOwnProperty(firstPlayerStrategy)) {
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

  generateRandomMatrixValues(type: GameType = GameType.Normal, minValue: number = 0, maxValue: number = 10): TwoPlayerMatrix {
    for (const firstPlayerStrategy of this.matrix.playersStrategies[0]) {
      for (const secondPlayerStrategy of this.matrix.playersStrategies[1]) {
        const firstPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
        const secondPlayerPayoff = type === GameType.ZeroSum ?
          -firstPlayerPayoff : Math.ceil(Math.random() * (maxValue - minValue) + minValue);
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

  calculateExpectedValues(mixedStrategies: MixedStrategy[]): number[] {
    const expectedValues: number[] = this.players.map(_ => 0);

    for (const firstStrategy of this.matrix.playersStrategies[0]) {
      const firstProbability = mixedStrategies[0].strategy.find(strategy => strategy.strategy === firstStrategy).probability;

      for (const secondStrategy of this.matrix.playersStrategies[1]) {
        const secondProbability = mixedStrategies[1].strategy.find(strategy => strategy.strategy === secondStrategy).probability;

        for (const player of this.players) {
          expectedValues[player.playerNumber] +=
            firstProbability * secondProbability *
            this.matrix.paymentsMatrix[firstStrategy][secondStrategy][player.playerNumber as number];
        }
      }
    }

    return expectedValues;
  }

  isPureEquilibrium(): boolean {
    const [s1, s2] = this.currentPlayerStrategies;
    const [payoff1, payoff2] = this.matrix.paymentsMatrix[s1.strategy][s2.strategy];
    const [player1Strategies, player2Strategies] = this.matrix.playersStrategies;

    // Check if player 1 has a better strategy given s2
    for (const otherStrategy of player1Strategies.filter(s => s !== s1.strategy)) {
      const [newPayoff, _] = this.matrix.paymentsMatrix[otherStrategy][s2.strategy];

      if (newPayoff > payoff1) { return false; }
    }

    // Check if player 2 has a better strategy given s1
    for (const otherStrategy of player2Strategies.filter(s => s !== s2.strategy)) {
      const [_, newPayoff] = this.matrix.paymentsMatrix[s1.strategy][otherStrategy];

      if (newPayoff > payoff2) { return false; }
    }

    return true;
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

    const mixedStrategies: MixedStrategy[] = this.calculateMixedStrategies();
    const expectedValues = this.calculateExpectedValues(mixedStrategies);

    return {
      scoreTable: [firstPlayer, secondPlayer],
      roundsTable: this.rounds,
      mixedStrategies: mixedStrategies.map((mixedStrategy, index) => ({ ...mixedStrategy, expectedValue: expectedValues[index]}))
    };
  }
}
