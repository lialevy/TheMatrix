import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";

@Component({
  selector: "app-game-page",
  templateUrl: "./game-page.component.html",
  styleUrls: ["./game-page.component.scss"],
})
export class GamePageComponent implements OnInit {
  constructor(private gameService: GameService) {}

  gameMatrix = this.gameService.generateRandomMatrixValues();
  firstPlayerStrategies = this.gameMatrix.playersStrategies[0];
  secondPlayerStrategies = this.gameMatrix.playersStrategies[1];
  paymentsMatrix = this.gameMatrix.paymentsMatrix;

  displayedColumns: string[] = [
    "playerStrategy",
    ...this.secondPlayerStrategies,
  ];

  dataSource = this.firstPlayerStrategies.map((rowStrategy) => {
    const tableRows = {
      playerStrategy: rowStrategy,
    };
    this.secondPlayerStrategies.forEach((colStrategy) => {
      tableRows[colStrategy] = this.paymentsMatrix[rowStrategy][colStrategy];
    });

    return tableRows;
  });

  handleFirstPlayerPick(firstPlayerPickedStrategy) {}

  ngOnInit(): void {}
}
