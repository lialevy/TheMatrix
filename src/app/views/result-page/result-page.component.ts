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
  displayedColumns: String[];
  dataSource: any;
  isTwoPlayers: boolean;
  firstPlayer: Player;
  secondPlayer: Player;
  thirdPlayer: Player;

  ngOnInit(): void {
    this.gameResults = this.gameService.getGameResults();
    this.isTwoPlayers = true;
    this.firstPlayer = this.gameResults.scoreTable[0];
    this.secondPlayer = this.gameResults.scoreTable[1];

    if (this.gameResults.scoreTable.length === 3) {
      this.isTwoPlayers = false;
      this.thirdPlayer = this.gameResults.scoreTable[2];
    }
    console.log(this.gameResults.roundsTable[0].playedStrategies);

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
      if (!this.isTwoPlayers) {
        tableRows.strategies.push(round.playedStrategies[2].strategy);
      }

      return tableRows;
    });
  }
}
