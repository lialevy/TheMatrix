import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  DoCheck,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";

@Component({
  selector: "app-setup-form",
  templateUrl: "./setup-form.component.html",
  styleUrls: ["./setup-form.component.scss"],
})
export class SetupFormComponent implements OnInit, OnChanges {
  @Input() gameSettings;

  @Output() gameSettingsChange;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log("im changed!");
  }

  ngOnInit(): void {}
}
