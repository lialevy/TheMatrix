import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-setup-form',
  templateUrl: './setup-form.component.html',
  styleUrls: ['./setup-form.component.scss']
})
export class SetupFormComponent implements OnInit {
  @Output() formChange: EventEmitter<any> = new EventEmitter();

  numberOfPlayers = 2;

  constructor() { }

  ngOnInit(): void {
  }

  numberOfPlayersChanged($event: MatRadioChange): void {
    this.formChange.emit($event);
  }
}
