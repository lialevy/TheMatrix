import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { Observable } from "rxjs";
import { Matrix, Round, Player, PlayerType } from "src/app/classes";
import { Router } from "@angular/router";

@Component({
  selector: "app-game-page",
  templateUrl: "./game-page.component.html",
  styleUrls: ["./game-page.component.scss"],
})
export class GamePageComponent implements OnInit {
  scores$: Observable<number[]>;
  round$: Observable<number>;
  lastRound$: Observable<Round>;

  gameMatrix: Matrix;
  isTwoPlayersGame: boolean;

  firstPlayerStrategies: string[];
  secondPlayerStrategies: string[];
  thirdPlayerStrategies: string[];
  firstPlayer: Player;
  secondPlayer: Player;
  thirdPlayer: Player;
  PLAYER_TYPES = PlayerType;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.gameMatrix = this.gameService.matrix;
    this.isTwoPlayersGame = this.gameService.players.length === 2;

    this.firstPlayer = this.gameService.players[0];
    this.secondPlayer = this.gameService.players[1];

    // this.firstPlayerName = this.gameService.players[0].name;
    // this.secondPlayerName = this.gameService.players[1].name;

    [
      this.firstPlayerStrategies,
      this.secondPlayerStrategies,
    ] = this.gameMatrix.playersStrategies;

    this.thirdPlayerStrategies = ["0"];

    if (!this.isTwoPlayersGame) {
      this.thirdPlayerStrategies = this.gameMatrix.playersStrategies[2];
      this.thirdPlayer = this.gameService.players[2];
      // this.thirdPlayerName = this.gameService.players[2].name;
    }

    this.scores$ = this.gameService.playerScores$;
    this.round$ = this.gameService.currentRoundNumber$;
    this.lastRound$ = this.gameService.lastRound$;

    this.gameService.gameFinished$.subscribe((_) => {
      this.router.navigate(["/result"]);
    });
  }

  handleFirstPlayerPick(firstPlayerPickedStrategy) {
    this.gameService.submitPlayerStrategy(0, firstPlayerPickedStrategy);
  }
  handleSecondPlayerPick(secondPlayerPickedStrategy) {
    this.gameService.submitPlayerStrategy(1, secondPlayerPickedStrategy);
  }
  handleThirdPlayerPick(thirdPlayerPickedStrategy) {
    this.gameService.submitPlayerStrategy(2, thirdPlayerPickedStrategy);
  }
}
