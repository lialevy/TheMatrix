import {
  Component,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { GameService } from "../../services/game.service";
import { Router } from "@angular/router";
import { Matrix, GameType, PlayerType, Player } from "src/app/classes";
import { Observable, Subject } from "rxjs";
import {
  NgForm,
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";

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

  user_data: any;
  gameMatrix: Matrix;
  gameMatrixTemplate$: Observable<any>;
  RandomMatrixString: string;
  gameMatrixTemplate: string;
  randomMatrixMinValue: number;
  randomMatrixMaxValue: number;
  GAME_TYPE = GameType;
  gameType: GameType;
  playerTypes: PlayerType[] = [PlayerType.Human];
  myPlayerTypes: { type: PlayerType }[] = [{ type: PlayerType.Human }];
  PLAYER_TYPES = PlayerType;

  constructor(
    private gameService: GameService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.user_data = this.formBuilder.group({
      numberOfRounds: [
        "",
        [Validators.min(1), Validators.max(10), Validators.required],
      ],
      gameMatrixNumOfRows: [
        "",
        [Validators.min(2), Validators.max(8), Validators.required],
      ],
      gameMatrixNumOfCols: [
        "",
        [Validators.min(2), Validators.max(8), Validators.required],
      ],
      gameMatrixDepth: ["", [Validators.min(2), Validators.max(8)]],
    });
  }

  ngOnInit(): void {
    this.RandomMatrixString = "Random Matrix";
    this.gameType = GameType.Normal;
    this.randomMatrixMinValue = 0;
    this.randomMatrixMaxValue = 10;
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
    this.myPlayerTypes.map((playerType) => {
      this.playerTypes.push(playerType.type);
    });
    console.log(this.playerTypes);
    this.gameService.finalizeGameSetup(this.playerTypes);
    this.router.navigate(["/game"]);
  }

  trackPlayerTypes(index: number, obj: any): any {
    return index;
  }

  recreateMatrix() {
    if (this.user_data.valid) {
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
    } else {
      this.gameMatrix = undefined;
    }
  }

  handleDimensionChange = this.recreateMatrix;
  handleMatrixTemplateChange = this.recreateMatrix;
  handleMatrixValuesChange = this.recreateMatrix;
  handleGameTypeChange = this.recreateMatrix;

  handleNumberOfPlayersChange() {
    this.gameService.setNumberOfPlayers(this.gameSettings.numberOfPlayers);
    this.gameType = GameType.Normal;
    if (this.gameSettings.numberOfPlayers === 3) {
      this.myPlayerTypes.push({ type: PlayerType.Human });
    } else {
      this.myPlayerTypes.pop();
      this.gameSettings.gameMatrixDepth = 2;
    }
    this.recreateMatrix();
  }
}
