import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Game,
  Matrix,
  Player,
  Round,
  ThreePlayerGame,
  TwoPlayerGame,
  GameType
} from '../classes';
import Templates from '../templates';
import GameServiceInterface, { Results } from './game-service.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService implements GameServiceInterface {
  #game: Game;
  #numberOfPlayers: number;
  #playerTemplatesSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  #currentTemplates: { [propName: string]: any };

  gameFinished$: Observable<boolean>;
  playerTemplates$: Observable<string[]> = this.#playerTemplatesSubject.asObservable();
  lastRound$: Observable<Round>;
  playerScores$: Observable<number[]>;
  currentRoundNumber$: Observable<number>;

  get numberOfRounds(): number {
    return this.#game.numberOfRounds;
  }

  get players(): Player[] {
    return this.#game.players;
  }

  get matrix(): Matrix {
    return this.#game.matrix;
  }

  get playerStrategies(): string[][] {
    return this.#game.matrix.playersStrategies;
  }

  constructor() {
    this.setNumberOfPlayers(2);
  }

  setNumberOfPlayers(numberOfPlayers: number): void {
    this.#numberOfPlayers = numberOfPlayers;

    if (this.#numberOfPlayers === 2) {
      this.#game = new TwoPlayerGame();
      this.#currentTemplates = Templates.TwoPlayerTemplates;
    } else if (this.#numberOfPlayers === 3) {
      this.#game = new ThreePlayerGame();
      this.#currentTemplates = Templates.ThreePlayerTemplates;
    } else {
      throw new Error('numberOfPlayers must be 2 or 3');
    }

    this.#playerTemplatesSubject.next(Object.keys(this.#currentTemplates));
    this.lastRound$ = this.#game.lastRound$;
    this.gameFinished$ = this.#game.gameFinished$;
    this.playerScores$ = this.#game.playerScores$;
    this.currentRoundNumber$ = this.#game.currentRound$;
  }

  // DEPRECATED
  /**
   * @deprecated use numberOfRounds instead
   */
  getNumberOfRounds(): number {
    return this.#game.numberOfRounds;
  }

  setNumberOfRounds(numberOfRounds: number): void {
    this.#game.setNumberOfRounds(numberOfRounds);
  }

  createGameMatrixByDimensions(
    rows: number,
    columns: number,
    depth?: number
  ): Matrix {
    return this.#game.createGameMatrix(rows, columns, depth);
  }

  createGameMatrixByTemplate(templateName: string): Matrix {
    const template = this.#currentTemplates[templateName];

    if (!template) {
      throw new Error(`Template ${templateName} doesn't exist`);
    } else {
      return this.#game.createGameMatrixByTemplate(template);
    }
  }

  generateRandomMatrixValues(
    type: GameType = GameType.Normal,
    minValue = 0,
    maxValue = 10
  ): Matrix {
    return this.#game.generateRandomMatrixValues(type, minValue, maxValue);
  }

  setMatrixValues(matrix: Matrix): void {
    this.#game.matrix = matrix;
  }

  /**
   * Validate game is ready and finalize game creation if required
   */
  finalizeGameSetup(): [boolean, string[]] {
    this.#game.finalizeGameSetup();
    return this.#game.validateGame();
  }

  // DEPRECATED
  /**
   * @deprecated use players instead
   */
  getPlayers(): Player[] {
    return this.#game.players;
  }

  // DEPRECATED
  /**
   * @deprecated use matrix instead
   */
  getGameMatrix(): Matrix {
    return this.#game.matrix;
  }

  // DEPRECATED
  /**
   * @deprecated use playerScores$ instead
   */
  getPlayerScoresObservable(): Observable<number[]> {
    return this.#game.playerScores$;
  }

  // DEPRECATED
  /**
   * @deprecated use currentRoundNumber$ instead
   */
  getRoundNumberObservable(): Observable<number> {
    return this.#game.currentRound$;
  }

  // DEPRECATED
  /**
   * @deprecated use playerStrategies instead
   */
  getPlayerStrategies(): string[][] {
    return this.#game.matrix.playersStrategies;
  }

  submitPlayerStrategy(player: number, strategy: string): void {
    this.#game.submitPlayerStrategy(player, strategy);
  }

  getGameResults(): Results {
    return this.#game.getGameResults();
  }
}
