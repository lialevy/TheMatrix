import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { Matrix } from "src/app/classes";

@Component({
  selector: "app-game-matrix",
  templateUrl: "./game-matrix.component.html",
  styleUrls: ["./game-matrix.component.scss"],
})
export class GameMatrixComponent implements OnInit, OnChanges {
  @Input() matrix: Matrix;

  isTwoPlayersGame: boolean;
  firstPlayerStrategies: string[];
  secondPlayerStrategies: string[];
  thirdPlayerStrategies: string[];
  displayedColumns: string[];
  dataSource: any;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.isTwoPlayersGame = this.matrix.playersStrategies.length === 2;

    [
      this.firstPlayerStrategies,
      this.secondPlayerStrategies,
    ] = this.matrix.playersStrategies;

    this.thirdPlayerStrategies = ["0"];

    if (!this.isTwoPlayersGame) {
      this.thirdPlayerStrategies = this.matrix.playersStrategies[2];
    }

    this.dataSource = this.thirdPlayerStrategies.map((matrixStrategy) => {
      const tableRows = {
        matrixStrategy: matrixStrategy,
        matrixRows: this.firstPlayerStrategies.map((rowStrategy) => {
          const rows = {
            playerStrategy: rowStrategy,
          };
          this.secondPlayerStrategies.forEach((colStrategy) => {
            rows[colStrategy] = this.matrix.paymentsMatrix[rowStrategy][
              colStrategy
            ];
          });
          return rows;
        }),
      };
      return tableRows;
    });

    this.displayedColumns = ["playerStrategy", ...this.secondPlayerStrategies];
  }

  ngOnInit(): void {}
}
