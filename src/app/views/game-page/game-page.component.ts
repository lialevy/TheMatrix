import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { Observable } from "rxjs";
import { Matrix } from "src/app/classes";
import { Router } from "@angular/router";

@Component({
  selector: "app-game-page",
  templateUrl: "./game-page.component.html",
  styleUrls: ["./game-page.component.scss"],
})
export class GamePageComponent implements OnInit {
  scores$: Observable<number[]>;
  round$: Observable<number>;

  gameMatrix: Matrix;
  isTwoPlayersGame: boolean;
  firstPlayerStrategies: string[];
  secondPlayerStrategies: string[];
  thirdPlayerStrategies: string[];
  firstPlayerName: string;
  secondPlayerName: string;
  thirdPlayerName: string;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.gameMatrix = this.gameService.generateRandomMatrixValues();
    this.isTwoPlayersGame = this.gameService.getPlayers().length === 2;
    this.firstPlayerName = this.gameService.getPlayers()[0].name;
    this.secondPlayerName = this.gameService.getPlayers()[1].name;

    [
      this.firstPlayerStrategies,
      this.secondPlayerStrategies,
    ] = this.gameMatrix.playersStrategies;

    this.thirdPlayerStrategies = ["0"];

    if (!this.isTwoPlayersGame) {
      this.thirdPlayerStrategies = this.gameMatrix.playersStrategies[2];
      this.thirdPlayerName = this.gameService.getPlayers()[2].name;
    }

    this.scores$ = this.gameService.getPlayerScoresObservable();
    this.round$ = this.gameService.getRoundNumberObservable();

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
