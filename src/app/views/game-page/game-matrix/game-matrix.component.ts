import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";

@Component({
  selector: "app-game-matrix",
  templateUrl: "./game-matrix.component.html",
  styleUrls: ["./game-matrix.component.scss"],
})
export class GameMatrixComponent implements OnInit {
  constructor(private gameService: GameService) {}

  ngOnInit(): void {}
}
