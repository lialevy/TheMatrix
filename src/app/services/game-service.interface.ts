import { Observable } from "rxjs";

export interface Player {
  _id: string; // uuid
  name?: string;
  cookies: number;
}

export interface Game {
  players: Player[];
  matrix: Matrix;
  rounds: Round[]
}

export interface Round {
  playedStrategies: number[];
  result: number[];
}

export interface Matrix {
  playersStrategies: string[][];
  paymentsMatrix: {
    [firstStrategy: string]: {
      [secondStrategy: string]: [number, number] | { [thirdStrategy: string]: [number, number, number] }
    }
  }
}

export interface Results {
  scoreTable: any;
  roundsTable: any;
}

export default interface GameService {
  game: Game;

  setNumberOfPlayers(numberOfPlayers: number): void;

  setNumberOfRounds(numberOfRounds: number): void;

  createGameMatrixByDimensions(rows: number, columns: number, depth?: number): Matrix;

  generateRandomMatrixValues(): Matrix;

  setMatrixValues(matrix: Matrix): void;

  finalizeGameSetup(): [boolean, string];

  getGameMatrix(): Matrix;

  getPlayerScoresObservable(): Observable<number[]>;

  getRoundNumberObservable(): Observable<number>;

  getPlayerStrategies(): string[][];

  submitPlayerStrategy(player: string, strategy: number): void;

  getGameResults(): Results;
}