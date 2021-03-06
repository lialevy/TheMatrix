import { Results } from '../services/game-service.interface';
import Strategy from './Strategy.class';
import Game from './Game.class';
import GameType from './GameType.enum';
import PlayerType from './PlayerType.enum';
import ComputerPlayer from './ComputerPlayers.class';
import ThreePlayerMatrix from './ThreePlayerMatrix.class';
import MixedStrategy from './MixedStrategy.class';
import Player from './Player.class';
import PureStrategy from './PureStrategy.class';
import PlayStyle from './PlayStyle.enum';

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

    this.matrix = matrix ? matrix : new ThreePlayerMatrix();

    this.numberOfRounds = numberOfRounds;
    this.rounds = [];
  }

  createPlayers(
    playerTypes: [PlayerType, PlayerType, PlayerType] = [
      PlayerType.Human,
      PlayerType.Human,
      PlayerType.Human,
    ]
  ): void {
    super.createPlayers(playerTypes, 3);
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
            if (
              Object.prototype.hasOwnProperty.call(
                paymentsMatrix[firstPlayerStrategy],
                secondPlayerStrategy
              )
            ) {
              paymentsMatrix[firstPlayerStrategy][secondPlayerStrategy][strategyName] = [];
            }
          }
        }
      }
    }

    this.matrix = new ThreePlayerMatrix();
    this.matrix.playersStrategies = [
      firstPlayerStrategies,
      secondPlayerStrategies,
      thirdPlayerStrategies,
    ];
    this.matrix.paymentsMatrix = paymentsMatrix;

    return this.matrix;
  }

  generateRandomMatrixValues(
    type: GameType = GameType.Normal,
    minValue: number = 0,
    maxValue: number = 10
  ): ThreePlayerMatrix {
    if (type === GameType.ZeroSum) {
      throw new Error('Three player game cannot be ZeroSum');
    }

    for (const firstPlayerStrategy of this.matrix.playersStrategies[0]) {
      for (const secondPlayerStrategy of this.matrix.playersStrategies[1]) {
        for (const thirdPlayerStrategy of this.matrix.playersStrategies[2]) {
          const firstPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
          const secondPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
          const thirdPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);

          this.matrix.paymentsMatrix[firstPlayerStrategy][secondPlayerStrategy][
            thirdPlayerStrategy
          ] = [firstPlayerPayoff, secondPlayerPayoff, thirdPlayerPayoff];
        }
      }
    }

    return this.matrix;
  }

  finalizeGameSetup(playerTypes?: [PlayerType, PlayerType, PlayerType]): void {
    playerTypes ? this.createPlayers(playerTypes) : this.createPlayers();

    for (const player of this.players) {
      if (player.type !== PlayerType.Human) {
        (player as ComputerPlayer).finalize(this.matrix);
      }
    }
  }

  validateGame(): [boolean, string[]] {
    const [, errors] = super.validateGame();

    if (this.players.length !== 3) {
      errors.push('Not enough players in game');
    }

    return [errors.length > 0, errors];
  }

  submitPlayerStrategy(playerIndex: number, strategy: string): boolean {
    const roundFinished = super.submitPlayerStrategy(playerIndex, strategy);

    if (roundFinished) {
      const [s1, s2, s3] = this.currentPlayerStrategies;
      const roundResult = this.matrix.paymentsMatrix[(s1 as PureStrategy).strategy][
        (s2 as PureStrategy).strategy
      ][(s3 as PureStrategy).strategy];

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

        for (const thirdStrategy of this.matrix.playersStrategies[2]) {
          const thirdProbability = mixedStrategies[2].strategy.find(
            (strategy) => strategy.strategy === thirdStrategy
          ).probability;

          for (const player of this.players) {
            expectedValues[player.playerNumber] +=
              firstProbability *
              secondProbability *
              thirdProbability *
              this.matrix.paymentsMatrix[firstStrategy][secondStrategy][thirdStrategy][
                player.playerNumber
              ];
          }
        }
      }
    }

    return expectedValues.map((value) => Number(value.toFixed(3)));
  }

  isPureEquilibrium(): boolean {
    const [s1, s2, s3] = this.currentPlayerStrategies;
    const [payoff1, payoff2, payoff3] = this.matrix.paymentsMatrix[(s1 as PureStrategy).strategy][
      (s2 as PureStrategy).strategy
    ][(s3 as PureStrategy).strategy];
    const [player1Strategies, player2Strategies, player3Strategies] = this.matrix.playersStrategies;

    // Check if player 1 has a better strategy given s2
    for (const otherStrategy of player1Strategies.filter((s) => s !== s1.strategy)) {
      const [newPayoff, _, __] = this.matrix.paymentsMatrix[otherStrategy][
        (s2 as PureStrategy).strategy
      ][(s3 as PureStrategy).strategy];

      if (newPayoff > payoff1) {
        return false;
      }
    }

    // Check if player 2 has a better strategy given s1
    for (const otherStrategy of player2Strategies.filter((s) => s !== s2.strategy)) {
      const [_, newPayoff, __] = this.matrix.paymentsMatrix[(s1 as PureStrategy).strategy][
        otherStrategy
      ][(s3 as PureStrategy).strategy];

      if (newPayoff > payoff2) {
        return false;
      }
    }

    for (const otherStrategy of player3Strategies.filter((s) => s !== s3.strategy)) {
      const [_, __, newPayoff] = this.matrix.paymentsMatrix[(s1 as PureStrategy).strategy][
        (s2 as PureStrategy).strategy
      ][otherStrategy];

      if (newPayoff > payoff3) {
        return false;
      }
    }

    return true;
  }

  getGameResults(): Results {
    let mixedStrategies: MixedStrategy[];
    switch (this.playStyle) {
      case PlayStyle.MixedStrategy:
        mixedStrategies = this.currentPlayerStrategies as [
          MixedStrategy,
          MixedStrategy,
          MixedStrategy
        ];
        mixedStrategies.forEach((ms) => (ms.player.cookies = ms.expectedValue));
        break;
      default:
        mixedStrategies = this.calculateMixedStrategies();
        break;
    }
    const expectedValues = this.calculateExpectedValues(mixedStrategies);

    let scoreTable;

    const mostCookies = this.players
      .map((p) => p.cookies)
      .reduce((maxCookies, currentCookies) =>
        maxCookies >= currentCookies ? maxCookies : currentCookies
      );

    const firstPlace = this.players.filter((p) => p.cookies === mostCookies);

    if (firstPlace.length === 3) {
      scoreTable = this.players.map((p) => ({ ...p, place: 1 }));
    } else if (firstPlace.length === 2) {
      const secondPlace = this.players.find((p) => p.cookies !== mostCookies);
      scoreTable = this.players.map((p) =>
        p.playerNumber !== secondPlace.playerNumber ? { ...p, place: 1 } : { ...p, place: 2 }
      );
    } else {
      const otherPlayers: (Player & { place?: 1 | 2 | 3 })[] = this.players.filter(
        (p) => p.playerNumber !== firstPlace[0].playerNumber
      );

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

      scoreTable = [{ ...firstPlace[0], place: 1 }, ...otherPlayers];
    }

    return {
      scoreTable,
      roundsTable: this.rounds,
      mixedStrategies: mixedStrategies.map((mixedStrategy, index) => ({
        ...mixedStrategy,
        expectedValue: expectedValues[index],
      })),
    };
  }
}
