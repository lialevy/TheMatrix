import {
  Component,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { GameService } from "../../services/game.service";
import { Router } from "@angular/router";
import { Matrix, GameType } from "src/app/classes";
import { Observable, Subject } from "rxjs";
import { NgForm } from "@angular/forms";

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
  gameMatrixTemplate$: Observable<any>;
  RandomMatrixString: string;
  gameMatrixTemplate: string;
  randomMatrixMinValue: number;
  randomMatrixMaxValue: number;
  gameType: GameType;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.RandomMatrixString = "Random Matrix";
    this.gameType = 0;
    this.gameMatrixTemplate = this.RandomMatrixString;
    this.gameMatrixTemplate$ = this.gameService.playerTemplates$;

    this.gameService.setNumberOfPlayers(this.gameSettings.numberOfPlayers);
    this.gameService.setNumberOfRounds(this.gameSettings.numberOfRounds);
    this.gameMatrix = this.gameService.createGameMatrixByDimensions(
      this.gameSettings.gameMatrixNumOfRows,
      this.gameSettings.gameMatrixNumOfCols,
      this.gameSettings.gameMatrixDepth
    );
    this.gameService.generateRandomMatrixValues(
      this.randomMatrixMinValue,
      this.randomMatrixMaxValue,
      this.gameType
    );
  }

  handleSubmit() {
    this.gameService.setNumberOfRounds(this.gameSettings.numberOfRounds);
    this.gameService.finalizeGameSetup();
    this.router.navigate(["/game"]);
  }

  recreateMatrix() {
    if (this.gameMatrixTemplate !== "Random Matrix") {
      this.gameMatrix = this.gameService.createGameMatrixByTemplate(
        this.gameMatrixTemplate
      );
    } else {
      this.gameMatrix = this.gameService.createGameMatrixByDimensions(
        this.gameSettings.gameMatrixNumOfRows,
        this.gameSettings.gameMatrixNumOfCols,
        this.gameSettings.gameMatrixDepth
      );
      this.gameService.generateRandomMatrixValues(
        this.randomMatrixMinValue,
        this.randomMatrixMaxValue,
        this.gameType
      );
    }
  }

  handleDimensionChange = this.recreateMatrix;
  handleMatrixTemplateChange = this.recreateMatrix;
  handleMatrixValuesChange = this.recreateMatrix;
  handleGameTypeChange = this.recreateMatrix;

  handleNumberOfPlayersChange() {
    this.gameService.setNumberOfPlayers(this.gameSettings.numberOfPlayers);
    this.gameType = 0;
    this.recreateMatrix();
  }
}
