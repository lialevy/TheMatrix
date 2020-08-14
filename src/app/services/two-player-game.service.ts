import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  Matrix,
  Player,
  Round,
  TwoPlayerGame,
  TwoPlayerMatrix,
} from "../classes";
import { Results, Strategy } from "./game-service.interface";

export interface PlayerGameService {
  playerScores$: Observable<number[]>;
  currentRound$: Observable<number>;
  gameFinished$: Observable<boolean>;

  createPlayers(): void;
  setNumberOfRounds(numberOfRounds: number): void;
  createGameMatrix(rows: number, columns: number, depth: number): Matrix;
  generateRandomMatrixValues(minValue?: number, maxValue?: number): Matrix;
  finalizeGameSetup(): void;
  validateGame(): [boolean, string[]];
  getPlayers(): Player[];
  getGameMatrix(): Matrix;
  getPlayerStrategies(): string[][];
  submitPlayerStrategy(playerIndex: number, strategy: string): void;
  getGameResults(): Results;
}

@Injectable({
  providedIn: "root",
})
export class TwoPlayerGameService implements PlayerGameService {
  private player1PossibleStrategies = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  private player2PossibleStrategies = "abcdefghijklmnopqrstuvwxyz".split("");
  private gameSubject: TwoPlayerGame;
  private playerScoresSubject: BehaviorSubject<number[]> = new BehaviorSubject(
    []
  );
  private roundSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  private gameFinishedSubject: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  private currentPlayerStrategies: [Strategy, Strategy] = [
    undefined,
    undefined,
  ];

  public playerScores$: Observable<
    number[]
  > = this.playerScoresSubject.asObservable();
  public currentRound$: Observable<number> = this.roundSubject.asObservable();
  public gameFinished$: Observable<
    boolean
  > = this.gameFinishedSubject.asObservable();

  constructor() {
    this.gameSubject = new TwoPlayerGame();
  }

  /**
   * Creates players
   */
  createPlayers(): void {
    this.gameSubject.createPlayers();

    this.playerScoresSubject.next(
      this.gameSubject.players.map((p) => p.cookies)
    );
  }
  setNumberOfRounds(numberOfRounds: number): void {
    this.gameSubject.numberOfRounds = numberOfRounds;
    this.roundSubject.next(1);
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
        if (
          Object.prototype.hasOwnProperty.call(
            paymentsMatrix,
            firstPlayerStrategy
          )
        ) {
          paymentsMatrix[firstPlayerStrategy][strategyName] = [];
        }
      }
    }

    this.gameSubject.matrix = {
      playersStrategies: [firstPlayerStrategies, secondPlayerStrategies],
      paymentsMatrix,
    };

    return this.gameSubject.matrix;
  }

  generateRandomMatrixValues(
    minValue: number = 0,
    maxValue: number = 10
  ): TwoPlayerMatrix {
    for (const firstPlayerStrategy of this.gameSubject.matrix
      .playersStrategies[0]) {
      for (const secondPlayerStrategy of this.gameSubject.matrix
        .playersStrategies[1]) {
        const firstPlayerPayoff = Math.ceil(
          Math.random() * (maxValue - minValue) + minValue
        );
        const secondPlayerPayoff = Math.ceil(
          Math.random() * (maxValue - minValue) + minValue
        );
        this.gameSubject.matrix.paymentsMatrix[firstPlayerStrategy][
          secondPlayerStrategy
        ] = [firstPlayerPayoff, secondPlayerPayoff];
      }
    }

    return this.gameSubject.matrix;
  }

  finalizeGameSetup(): void {
    if (!this.gameSubject.players || this.gameSubject.players.length === 0) {
      this.createPlayers();
    }
  }

  validateGame(): [boolean, string[]] {
    const errors: string[] = [];

    if (this.gameSubject.players.length !== 2) {
      errors.push("No players in game");
    }

    if (!this.gameSubject.numberOfRounds) {
      errors.push("No rounds were set");
    }

    if (!this.gameSubject.matrix) {
      errors.push("No game matrix was set");
    } else {
      if (
        !this.gameSubject.matrix.playersStrategies ||
        !(
          this.gameSubject.matrix.playersStrategies.length !==
          this.gameSubject.players.length
        )
      ) {
        errors.push(
          "Number of player strategies do not match number of players in game"
        );
      }

      if (!this.gameSubject.matrix.paymentsMatrix) {
        errors.push("Payments matrix is not defined");
      }
    }

    return [errors.length > 0, errors];
  }

  getPlayers(): Player[] {
    return this.gameSubject.players;
  }

  getGameMatrix(): TwoPlayerMatrix {
    return this.gameSubject.matrix;
  }

  getPlayerStrategies(): string[][] {
    return this.gameSubject.matrix.playersStrategies;
  }

  submitPlayerStrategy(playerIndex: number, strategy: string): void {
    this.currentPlayerStrategies[playerIndex] = {
      player: this.gameSubject.players[playerIndex],
      strategy,
    };

    // Finish round
    if (
      this.currentPlayerStrategies[0] !== undefined &&
      this.currentPlayerStrategies[1] !== undefined
    ) {
      const [s1, s2] = this.currentPlayerStrategies;
      const roundResult = this.gameSubject.matrix.paymentsMatrix[s1.strategy][
        s2.strategy
      ];

      const round = new Round(this.currentPlayerStrategies, roundResult);

      this.gameSubject.players[0].cookies += roundResult[0];
      this.gameSubject.players[1].cookies += roundResult[1];
      this.gameSubject.rounds.push(round);

      this.currentPlayerStrategies = [undefined, undefined];
      this.playerScoresSubject.next([
        this.gameSubject.players[0].cookies,
        this.gameSubject.players[1].cookies,
      ]);

      if (this.roundSubject.value < this.gameSubject.numberOfRounds) {
        this.roundSubject.next(this.roundSubject.value + 1);
      } else {
        this.gameFinishedSubject.next(true);
      }
    }
  }

  getGameResults(): Results {
    const [firstPlayer, secondPlayer]: (Player & {
      place?: 1 | 2 | 3;
    })[] = this.getPlayers();

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
      roundsTable: this.gameSubject.rounds,
    };
  }
}
