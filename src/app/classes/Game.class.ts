import { BehaviorSubject, Observable } from 'rxjs';
import MixedStrategy from './MixedStrategy.class';
import ThreePlayerMatrix from './ThreePlayerMatrix.class';
import TwoPlayerMatrix from './TwoPlayerMatrix.class';
import { Results } from '../services/game-service.interface';
import Player from './Player.class';
import ComputerPlayer, { RandomComputerPlayer, MaxMinComputerPlayer } from './ComputerPlayers.class';
import Round from './Round.class';
import Strategy from './Strategy.class';
import PlayerType from './PlayerType.enum';
import GameType from './GameType.enum';
import { skipWhile, tap } from 'rxjs/operators';
import Matrix from './Matrix.class';

const playerTypeClasses = {};
playerTypeClasses[PlayerType.Human] = Player;
playerTypeClasses[PlayerType.Random] = RandomComputerPlayer;
playerTypeClasses[PlayerType.MaxMin] = MaxMinComputerPlayer;

export default abstract class Game {
  #playerScoresSubject: BehaviorSubject<number[]> = new BehaviorSubject([]);
  #roundSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  #gameFinishedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  #lastRoundSubject: BehaviorSubject<Round> = new BehaviorSubject(undefined);

  protected player1PossibleStrategies = 'ABCDEFGHIJKLM'.split('');
  protected player2PossibleStrategies = 'abcdefghijklm'.split('');
  protected currentPlayerStrategies: Strategy[];

  playerScores$: Observable<number[]> = this.#playerScoresSubject.asObservable();
  currentRound$: Observable<number> = this.#roundSubject.asObservable();
  gameFinished$: Observable<boolean> = this.#gameFinishedSubject.asObservable().pipe(
    skipWhile(finished => !finished)
  );
  lastRound$: Observable<Round> = this.#lastRoundSubject.asObservable();

  abstract matrix: Matrix;
  players: Player[];
  numberOfRounds: number;
  rounds: Round[];

  constructor() { }

  createPlayers(playerTypes: PlayerType[], numberOfPlayers: number): void {
    this.players = [];

    for (let playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
      const playerType = playerTypes ? playerTypes[playerIndex] : PlayerType.Human;
      const playerClass = playerTypeClasses[playerType];

      this.players.push(new playerClass(playerIndex as 0 | 1 | 2));
    }

    this.#playerScoresSubject.next(this.players.map(p => p.cookies));
  }

  setNumberOfRounds(numberOfRounds: number): void {
    this.numberOfRounds = numberOfRounds;
    this.#roundSubject.next(1);
  }

  abstract createGameMatrix(rows: number, columns: number, depth: number): Matrix;

  createGameMatrixByTemplate(template: any): Matrix {
    this.matrix = (this.players.length === 2) ? new TwoPlayerMatrix() : new ThreePlayerMatrix();
    this.matrix.playersStrategies = [];
    this.matrix.paymentsMatrix = template;

    const drillDown = (x: any) => { for (const y in x) { if (x[y] !== undefined) { return x[y]; } } };

    let currentMatrix = this.matrix.paymentsMatrix;
    let reducedMatrix = drillDown(drillDown(currentMatrix));

    while (reducedMatrix !== undefined) {
      this.matrix.playersStrategies.push(Object.keys(currentMatrix));

      currentMatrix = drillDown(currentMatrix);
      reducedMatrix = drillDown(reducedMatrix);
    }

    return this.matrix;
  }

  abstract generateRandomMatrixValues(type: GameType, minValue?: number, maxValue?: number): Matrix;
  abstract finalizeGameSetup(playerTypes?: PlayerType[]): void;

  validateGame(): [boolean, string[]] {
    const errors: string[] = [];

    if (!this.numberOfRounds) {
      errors.push('No rounds were set');
    }

    if (!this.matrix) {
      errors.push('No game matrix was set');
    } else {
      if (!this.matrix.playersStrategies ||
          !(this.matrix.playersStrategies.length !== this.players.length)) {
        errors.push('Number of player strategies do not match number of players in game');
      }

      if (!this.matrix.paymentsMatrix) {
        errors.push('Payments matrix is not defined');
      }
    }

    return [(errors.length > 0), errors];
  }

  submitPlayerStrategy(playerIndex: number, strategy: string): boolean {
    this.currentPlayerStrategies[playerIndex] = {
      player: this.players[playerIndex],
      strategy
    };

    const roundFinished = this.players.reduce(
      (prev, curr) =>
        prev &&
        (curr.type !== PlayerType.Human ||
          this.currentPlayerStrategies[curr.playerNumber] !== undefined),
      true
    );

    if (roundFinished) {
      for (const player of this.players) {
        if (player.type !== PlayerType.Human) {
          this.currentPlayerStrategies[player.playerNumber] = new Strategy(
            player,
            (player as ComputerPlayer).play(this.matrix.playersStrategies[player.playerNumber])
          );
        }
      }
    }

    return roundFinished;
  }

  finishRound(roundResult: number[]): void {
    const pureEquilibrium = this.isPureEquilibrium();

    const round = new Round(this.currentPlayerStrategies, roundResult, pureEquilibrium);
    this.rounds.push(round);
    this.#lastRoundSubject.next(round);

    this.players.forEach((player, index) => (player.cookies += roundResult[index]));

    this.currentPlayerStrategies.fill(undefined);
    this.#playerScoresSubject.next(this.players.map(p => p.cookies));

    if (this.#roundSubject.value < this.numberOfRounds) {
      this.#roundSubject.next(this.#roundSubject.value + 1);
    } else {
      this.#gameFinishedSubject.next(true);
    }
  }

  abstract isPureEquilibrium(): boolean;

  abstract getGameResults(): Results;

  protected calculateMixedStrategies(): MixedStrategy[] {
    const mixedStrategies: MixedStrategy[] = [];

    for (const player of this.players) {
      const playedStrategies = this.rounds.map(round => round.playedStrategies[player.playerNumber].strategy);
      const playerStrategies = this.matrix.playersStrategies[player.playerNumber];

      const strategyCounter = playerStrategies.reduce((counter, strategy) => { counter[strategy] = 0; return counter; }, {});

      playedStrategies.forEach(strategy => strategyCounter[strategy]++);

      const mixedStrategy = new MixedStrategy(
        player,
        playerStrategies.map(strategy => ({
          strategy,
          probability: Number((strategyCounter[strategy] / this.rounds.length).toFixed(3))
        }))
      );

      const sum = mixedStrategy.strategy.reduce(
        (prev, curr, index) => prev + (index !== mixedStrategy.strategy.length - 1 ? curr.probability : 0), 0
      );

      mixedStrategy.strategy[mixedStrategy.strategy.length - 1].probability = Number((1 - sum).toFixed(3));

      mixedStrategies.push(mixedStrategy);
    }

    return mixedStrategies;
  }
}
