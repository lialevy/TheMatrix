import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-setup-page',
  templateUrl: './game-setup-page.component.html',
  styleUrls: ['./game-setup-page.component.scss']
})
export class GameSetupPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  printfunc($event: any): void {
    console.log($event);
  }
}
