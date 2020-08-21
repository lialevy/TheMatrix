import { Component, EventEmitter, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { Router } from "@angular/router";
import { Matrix } from "src/app/classes";
import { Observable, Subject } from "rxjs";

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
    gameMatrixDepth: 2,
  };

  gameMatrix: Matrix;
  //predefinedMatrix: any[];
  gameMatrixTemplate$: Observable<any>;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.gameMatrixTemplate$ = this.gameService.playerTemplates$;
    // TODO: change predefinedMatrix to the options from dor
    // this.predefinedMatrix = [
    //   { value: 0, viewValue: "manual" },
    //   { value: 1, viewValue: "option 1" },
    //   { value: 2, viewValue: "option 2" },
    // ];
    this.gameService.setNumberOfPlayers(this.gameSettings.numberOfPlayers);
    this.gameService.setNumberOfRounds(this.gameSettings.numberOfRounds);
    this.gameMatrix = this.gameService.createGameMatrixByDimensions(
      this.gameSettings.gameMatrixNumOfRows,
      this.gameSettings.gameMatrixNumOfCols,
      this.gameSettings.gameMatrixDepth
    );

    this.gameService.finalizeGameSetup();
  }

  handleSubmit() {
    //TODO: set predefinedMatrix
    this.gameService.setNumberOfPlayers(this.gameSettings.numberOfPlayers);
    this.gameService.setNumberOfRounds(this.gameSettings.numberOfRounds);
    this.gameService.createGameMatrixByDimensions(
      this.gameSettings.gameMatrixNumOfRows,
      this.gameSettings.gameMatrixNumOfCols,
      this.gameSettings.gameMatrixDepth
    );
    this.gameService.finalizeGameSetup();
    this.router.navigate(["/game"]);
  }

  recreateMatrix() {
    this.gameMatrix = this.gameService.createGameMatrixByDimensions(
      this.gameSettings.gameMatrixNumOfRows,
      this.gameSettings.gameMatrixNumOfCols,
      this.gameSettings.gameMatrixDepth
    );
  }
  handleDimensionChange = this.recreateMatrix;

  handleNumberOfPlayersChange() {
    this.gameService.setNumberOfPlayers(this.gameSettings.numberOfPlayers);
    this.recreateMatrix();
  }
}
