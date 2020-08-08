import { Component, EventEmitter, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";

export interface GameSettings {
  numberOfPlayers: 2 | 3;
  numberOfRounds: number;
  gameMatrixNumOfRows: number;
  gameMatrixNumOfCols: number;
  gameMatrixDepth: number;
}

@Component({
  selector: "app-game-setup-page",
  templateUrl: "./game-setup-page.component.html",
  styleUrls: ["./game-setup-page.component.scss"],
})
export class GameSetupPageComponent implements OnInit {
  gameSettings: GameSettings = {
    numberOfPlayers: 2,
    numberOfRounds: 1,
    gameMatrixNumOfRows: 2,
    gameMatrixNumOfCols: 2,
    gameMatrixDepth: 1,
  };

  constructor(private gameService: GameService) {}

  handleSubmit() {
    this.gameService.setNumberOfPlayers(this.gameSettings.numberOfPlayers);
    this.gameService.setNumberOfRounds(this.gameSettings.gameMatrixNumOfRows);
    this.gameService.createGameMatrixByDimensions(
      this.gameSettings.gameMatrixNumOfRows,
      this.gameSettings.gameMatrixNumOfCols,
      this.gameSettings.gameMatrixDepth
    );
  }

  ngOnInit(): void {}
}
