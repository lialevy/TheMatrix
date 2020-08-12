import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { Observable } from "rxjs";
import { Matrix } from "src/app/classes";

@Component({
  selector: "app-game-page",
  templateUrl: "./game-page.component.html",
  styleUrls: ["./game-page.component.scss"],
})
export class GamePageComponent implements OnInit {
  scores$: Observable<number[]>;

  gameMatrix: Matrix;
  firstPlayerStrategies: string[];
  secondPlayerStrategies: string[];
  displayedColumns: string[];
  dataSource: any;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameMatrix = this.gameService.generateRandomMatrixValues();

    [
      this.firstPlayerStrategies,
      this.secondPlayerStrategies,
    ] = this.gameMatrix.playersStrategies;

    this.displayedColumns = ["playerStrategy", ...this.secondPlayerStrategies];

    this.dataSource = this.firstPlayerStrategies.map((rowStrategy) => {
      const tableRows = {
        playerStrategy: rowStrategy,
      };
      this.secondPlayerStrategies.forEach((colStrategy) => {
        tableRows[colStrategy] = this.gameMatrix.paymentsMatrix[rowStrategy][
          colStrategy
        ];
      });

      return tableRows;
    });

    this.scores$ = this.gameService.getPlayerScoresObservable();
  }

  handleFirstPlayerPick(firstPlayerPickedStrategy) {
    this.gameService.submitPlayerStrategy(0, firstPlayerPickedStrategy);
  }
  handleSecondPlayerPick(secondPlayerPickedStrategy) {
    this.gameService.submitPlayerStrategy(1, secondPlayerPickedStrategy);
  }
}
