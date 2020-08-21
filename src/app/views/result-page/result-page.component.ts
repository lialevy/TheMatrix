import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { Round, Player } from "src/app/classes";
import { Results } from "src/app/services/game-service.interface";

@Component({
  selector: "app-result-page",
  templateUrl: "./result-page.component.html",
  styleUrls: ["./result-page.component.scss"],
})
export class ResultPageComponent implements OnInit {
  constructor(private gameService: GameService) {}
  gameResults: Results;
  displayedColumns: string[];
  dataSource: any;
  isTwoPlayersGame: boolean;
  // firstPlayer: Player & { place?: 1 | 2 | 3 };
  // secondPlayer: Player & { place?: 1 | 2 | 3 };
  // thirdPlayer: Player & { place?: 1 | 2 | 3 };
  scoreTable: (Player & { place?: 1 | 2 | 3 })[];
  firstPlacePlayer: (Player & { place?: 1 | 2 | 3 })[];
  secondPlacePlayer: (Player & { place?: 1 | 2 | 3 })[];
  thirdPlacePlayer: (Player & { place?: 1 | 2 | 3 })[];

  ngOnInit(): void {
    this.gameResults = this.gameService.getGameResults();
    this.isTwoPlayersGame = this.gameService.getPlayers().length === 2;

    // this.firstPlayer = this.gameResults.scoreTable[0];
    // this.secondPlayer = this.gameResults.scoreTable[1];
    // if (!this.isTwoPlayersGame) {
    //   this.thirdPlayer = this.gameResults.scoreTable[2];
    // }

    this.firstPlacePlayer = [];
    this.secondPlacePlayer = [];
    this.thirdPlacePlayer = [];

    this.scoreTable = this.gameResults.scoreTable;
    this.scoreTable.forEach((player) => {
      if (player.place === 1) {
        this.firstPlacePlayer.push(player);
      } else if (player.place === 2) {
        this.secondPlacePlayer.push(player);
      } else if (player.place === 3) {
        this.thirdPlacePlayer.push(player);
      }
    });

    this.displayedColumns = ["Round No.", "Result", "Strategies"];
    let i = 1;
    this.dataSource = this.gameResults.roundsTable.map((round) => {
      const tableRows = {
        roundNum: i++,
        result: round.result,
        strategies: [
          round.playedStrategies[0].strategy,
          round.playedStrategies[1].strategy,
        ],
      };
      if (!this.isTwoPlayersGame) {
        tableRows.strategies.push(round.playedStrategies[2].strategy);
      }

      return tableRows;
    });
  }
}
