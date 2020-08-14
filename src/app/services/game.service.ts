import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  Game,
  Matrix,
  Player,
  ThreePlayerGame,
  TwoPlayerGame,
} from "../classes";
import GameServiceInterface, { Results } from "./game-service.interface";

@Injectable({
  providedIn: "root",
})
export class GameService implements GameServiceInterface {
  private game: Game;
  private numberOfPlayers: number;

  public gameFinished$: Observable<boolean>;

  constructor() {}

  setNumberOfPlayers(numberOfPlayers: number): void {
    this.numberOfPlayers = numberOfPlayers;

    if (this.numberOfPlayers === 2) {
      this.game = new TwoPlayerGame();
    } else if (this.numberOfPlayers === 3) {
      this.game = new ThreePlayerGame();
    } else {
      throw new Error("numberOfPlayers must be 2 or 3");
    }

    this.gameFinished$ = this.game.gameFinished$;
  }

  setNumberOfRounds(numberOfRounds: number): void {
    this.game.setNumberOfRounds(numberOfRounds);
  }

  createGameMatrixByDimensions(
    rows: number,
    columns: number,
    depth?: number
  ): Matrix {
    return this.game.createGameMatrix(rows, columns, depth);
  }

  generateRandomMatrixValues(): Matrix {
    return this.game.generateRandomMatrixValues();
  }

  setMatrixValues(matrix: Matrix): void {
    throw new Error("Not supporting manual matrix input");
  }

  /**
   * Validate game is ready and finalize game creation if required
   */
  finalizeGameSetup(): [boolean, string[]] {
    this.game.finalizeGameSetup();
    return this.game.validateGame();
  }

  getPlayers(): Player[] {
    return this.game.players;
  }

  getGameMatrix(): Matrix {
    return this.game.matrix;
  }

  getPlayerScoresObservable(): Observable<number[]> {
    return this.game.playerScores$;
  }

  getRoundNumberObservable(): Observable<number> {
    return this.game.currentRound$;
  }

  getPlayerStrategies(): string[][] {
    return this.game.matrix.playersStrategies;
  }

  submitPlayerStrategy(player: number, strategy: string): void {
    this.game.submitPlayerStrategy(player, strategy);
  }

  getGameResults(): Results {
    return this.game.getGameResults();
  }
}
