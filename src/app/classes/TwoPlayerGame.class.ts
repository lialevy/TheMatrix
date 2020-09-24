import Player from './Player.class';
import Game from './Game.class';
import GameType from './GameType.enum';
import Strategy from './Strategy.class';
import { Results } from '../services/game-service.interface';
import MixedStrategy from './MixedStrategy.class';
import TwoPlayerMatrix from './TwoPlayerMatrix.class';
import PlayerType from './PlayerType.enum';
import ComputerPlayer from './ComputerPlayers.class';
import PureStrategy from './PureStrategy.class';
import PlayStyle from './PlayStyle.enum';

export default class TwoPlayerGame extends Game {
  matrix: TwoPlayerMatrix;

  protected currentPlayerStrategies: [Strategy, Strategy] = [undefined, undefined];

  constructor(matrix?: TwoPlayerMatrix, numberOfRounds: number = 1) {
    super();

    this.createPlayers();

    this.matrix = matrix ? matrix : new TwoPlayerMatrix();

    this.numberOfRounds = numberOfRounds;
    this.rounds = [];
  }

  createPlayers(
    playerTypes: [PlayerType, PlayerType] = [PlayerType.Human, PlayerType.Human]
  ): void {
    super.createPlayers(playerTypes, 2);
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

    this.matrix = new TwoPlayerMatrix();
    this.matrix.playersStrategies = [firstPlayerStrategies, secondPlayerStrategies];
    this.matrix.paymentsMatrix = paymentsMatrix;

    return this.matrix;
  }

  generateRandomMatrixValues(
    type: GameType = GameType.Normal,
    minValue: number = 0,
    maxValue: number = 10
  ): TwoPlayerMatrix {
    for (const firstPlayerStrategy of this.matrix.playersStrategies[0]) {
      for (const secondPlayerStrategy of this.matrix.playersStrategies[1]) {
        const negativePlayer = (type !== GameType.ZeroSum || Math.random() - 0.5) > 0 ? 1 : -1;

        const firstPlayerPayoff =
          negativePlayer * Math.ceil(Math.random() * (maxValue - minValue) + minValue);
        const secondPlayerPayoff =
          type === GameType.ZeroSum
            ? -firstPlayerPayoff
            : Math.ceil(Math.random() * (maxValue - minValue) + minValue);
        this.matrix.paymentsMatrix[firstPlayerStrategy][secondPlayerStrategy] = [
          firstPlayerPayoff,
          secondPlayerPayoff,
        ];
      }
    }

    return this.matrix;
  }

  finalizeGameSetup(playerTypes?: [PlayerType, PlayerType]): void {
    playerTypes ? this.createPlayers(playerTypes) : this.createPlayers();

    for (const player of this.players) {
      if (player.type !== PlayerType.Human) {
        (player as ComputerPlayer).finalize(this.matrix);
      }
    }
  }

  validateGame(): [boolean, string[]] {
    const [, errors] = super.validateGame();

    if (this.players.length !== 2) {
      errors.push('Not enough players in game');
    }

    return [errors.length > 0, errors];
  }

  submitPlayerStrategy(playerIndex: number, strategy: string): boolean {
    const roundFinished = super.submitPlayerStrategy(playerIndex, strategy);

    if (roundFinished) {
      const [s1, s2] = this.currentPlayerStrategies;
      const roundResult = this.matrix.paymentsMatrix[(s1 as PureStrategy).strategy][
        (s2 as PureStrategy).strategy
      ];

      super.finishRound(roundResult);
    }

    return roundFinished;
  }

  simulateRound(): void {
    throw new Error('Method not implemented.');
  }

  calculateExpectedValues(mixedStrategies: MixedStrategy[]): number[] {
    const expectedValues: number[] = this.players.map((_) => 0);

    for (const firstStrategy of this.matrix.playersStrategies[0]) {
      const firstProbability = mixedStrategies[0].strategy.find(
        (strategy) => strategy.strategy === firstStrategy
      ).probability;

      for (const secondStrategy of this.matrix.playersStrategies[1]) {
        const secondProbability = mixedStrategies[1].strategy.find(
          (strategy) => strategy.strategy === secondStrategy
        ).probability;

        for (const player of this.players) {
          expectedValues[player.playerNumber] +=
            firstProbability *
            secondProbability *
            this.matrix.paymentsMatrix[firstStrategy][secondStrategy][
              player.playerNumber as number
            ];
        }
      }
    }

    return expectedValues.map((value) => Number(value.toFixed(3)));
  }

  isPureEquilibrium(): boolean {
    const [s1, s2] = this.currentPlayerStrategies;
    const [payoff1, payoff2] = this.matrix.paymentsMatrix[(s1 as PureStrategy).strategy][
      (s2 as PureStrategy).strategy
    ];
    const [player1Strategies, player2Strategies] = this.matrix.playersStrategies;

    // Check if player 1 has a better strategy given s2
    for (const otherStrategy of player1Strategies.filter((s) => s !== s1.strategy)) {
      const [newPayoff, _] = this.matrix.paymentsMatrix[otherStrategy][
        (s2 as PureStrategy).strategy
      ];

      if (newPayoff > payoff1) {
        return false;
      }
    }

    // Check if player 2 has a better strategy given s1
    for (const otherStrategy of player2Strategies.filter((s) => s !== s2.strategy)) {
      const [_, newPayoff] = this.matrix.paymentsMatrix[(s1 as PureStrategy).strategy][
        otherStrategy
      ];

      if (newPayoff > payoff2) {
        return false;
      }
    }

    return true;
  }

  getGameResults(): Results {
    let mixedStrategies: MixedStrategy[];
    switch (this.playStyle) {
      case PlayStyle.MixedStrategy:
        mixedStrategies = this.currentPlayerStrategies as [MixedStrategy, MixedStrategy];
        mixedStrategies.forEach((ms) => (ms.player.cookies = ms.expectedValue));
        break;
      default:
        mixedStrategies = this.calculateMixedStrategies();
        break;
    }

    const expectedValues = this.calculateExpectedValues(mixedStrategies);

    const [firstPlayer, secondPlayer]: (Player & {
      place?: 1 | 2 | 3;
    })[] = this.players;

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
      roundsTable: this.rounds,
      mixedStrategies: mixedStrategies.map((mixedStrategy, index) => ({
        ...mixedStrategy,
        expectedValue: expectedValues[index],
      })),
    };
  }
}
