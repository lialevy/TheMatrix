import { Observable } from 'rxjs';
import { Matrix, Player, TwoPlayerGame } from '../classes';

export type Game = TwoPlayerGame;

export interface Strategy {
  player: Player;
  strategy: string;
}

// export interface Matrix {
//   playersStrategies: string[][];
//   paymentsMatrix: {
//     [firstStrategy: string]: {
//       [secondStrategy: string]: [number, number] | { [thirdStrategy: string]: [number, number, number] }
//     }
//   };
// }

export interface Results {
  scoreTable: any;
  roundsTable: any;
}

export default interface GameServiceInterface {
  // TODO
  setNumberOfPlayers(numberOfPlayers: number): void;

  // TODO
  setNumberOfRounds(numberOfRounds: number): void;

  // TODO
  createGameMatrixByDimensions(rows: number, columns: number, depth?: number): Matrix;

  // TODO
  generateRandomMatrixValues(): Matrix;

  setMatrixValues(matrix: Matrix): void;

  finalizeGameSetup(): [boolean, string[]];

  getGameMatrix(): Matrix;

  getPlayerScoresObservable(): Observable<number[]>;

  getRoundNumberObservable(): Observable<number>;

  getPlayerStrategies(): string[][];

  submitPlayerStrategy(player: string, strategy: number): void;

  getGameResults(): Results;
}
