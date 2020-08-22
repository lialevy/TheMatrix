import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { Round, Player, MixedStrategy } from "src/app/classes";
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

  scoreTable: (Player & { place?: 1 | 2 | 3 })[];
  firstPlacePlayer: (Player & { place?: 1 | 2 | 3 })[];
  secondPlacePlayer: (Player & { place?: 1 | 2 | 3 })[];
  thirdPlacePlayer: (Player & { place?: 1 | 2 | 3 })[];

  mixedStrategySummary: MixedStrategy[];
  summaryDisplayedColumns: string[];
  summaryDataSource: any;

  ngOnInit(): void {
    this.gameResults = this.gameService.getGameResults();
    this.isTwoPlayersGame = this.gameService.players.length === 2;

    //podium
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

    //score table
    this.displayedColumns = [
      "Round No.",
      "Result",
      "Strategies",
      "Pure Equilibrium",
    ];
    let i = 1;
    this.dataSource = this.gameResults.roundsTable.map((round) => {
      const tableRows = {
        roundNum: i++,
        result: round.result,
        strategies: [
          round.playedStrategies[0].strategy,
          round.playedStrategies[1].strategy,
        ],
        pureEquilibrium: round.pureEquilibrium,
      };
      if (!this.isTwoPlayersGame) {
        tableRows.strategies.push(round.playedStrategies[2].strategy);
      }

      return tableRows;
    });

    // summary table
    this.mixedStrategySummary = this.gameResults.mixedStrategies;
    this.summaryDisplayedColumns = [
      "Player",
      "Mixed Strategy",
      "Expected Value",
    ];

    const playerMixedStrategyByNumber = this.gameResults.mixedStrategies.map(
      (playerMixedStrategy) => {
        return playerMixedStrategy.strategy.map((s) => {
          return [`${s.strategy}: ${s.probability}`];
        });
      }
    );

    this.summaryDataSource = this.gameResults.mixedStrategies.map(
      (playerMixedStrategy) => {
        const summaryTableRows = {
          player: playerMixedStrategy.player.name,
          strategies: [
            playerMixedStrategyByNumber[
              playerMixedStrategy.player.playerNumber
            ],
          ],
          expectedValue: playerMixedStrategy.expectedValue,
        };

        return summaryTableRows;
      }
    );
  }
}
