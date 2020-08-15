import { Observable } from 'rxjs';
import { Matrix, Player, Round } from '../classes';

export interface Results {
  scoreTable: (Player & { place?: 1 | 2 | 3 })[];
  roundsTable: Round[];
}

export default interface GameServiceInterface {
  gameFinished$: Observable<boolean>;

  setNumberOfPlayers(numberOfPlayers: number): void;

  setNumberOfRounds(numberOfRounds: number): void;

  createGameMatrixByDimensions(rows: number, columns: number, depth?: number): Matrix;

  createGameMatrixByTemplate(templateName: string): Matrix;

  generateRandomMatrixValues(): Matrix;

  setMatrixValues(matrix: Matrix): void;

  finalizeGameSetup(): [boolean, string[]];

  getGameMatrix(): Matrix;

  getPlayerScoresObservable(): Observable<number[]>;

  getRoundNumberObservable(): Observable<number>;

  getPlayerStrategies(): string[][];

  submitPlayerStrategy(player: number, strategy: string): void;

  getGameResults(): Results;
}
