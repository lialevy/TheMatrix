import { Observable } from 'rxjs';
import { Matrix, MixedStrategy, Player, Round } from '../classes';
import { GameType } from '../classes/Game.class';

export interface Results {
  scoreTable: (Player & { place?: 1 | 2 | 3 })[];
  roundsTable: Round[];
  mixedStrategies: MixedStrategy[];
}

export default interface GameServiceInterface {
  gameFinished$: Observable<boolean>;

  setNumberOfPlayers(numberOfPlayers: number): void;

  getNumberOfRounds(): number;

  setNumberOfRounds(numberOfRounds: number): void;

  createGameMatrixByDimensions(rows: number, columns: number, depth?: number): Matrix;

  createGameMatrixByTemplate(templateName: string): Matrix;

  generateRandomMatrixValues(type: GameType, minValue?: number, maxValue?: number): Matrix;

  setMatrixValues(matrix: Matrix): void;

  finalizeGameSetup(): [boolean, string[]];

  getGameMatrix(): Matrix;

  getPlayerScoresObservable(): Observable<number[]>;

  getRoundNumberObservable(): Observable<number>;

  getPlayerStrategies(): string[][];

  submitPlayerStrategy(player: number, strategy: string): void;

  getGameResults(): Results;
}
