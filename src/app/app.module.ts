import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

// Angular Material Imports
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GameSetupPageComponent } from "./views/game-setup-page/game-setup-page.component";
import { GamePageComponent } from "./views/game-page/game-page.component";
import { ResultPageComponent } from "./views/result-page/result-page.component";
import { SetupFormComponent } from "./views/game-setup-page/setup-form/setup-form.component";
import { SetupMatrixComponent } from "./views/game-setup-page/setup-matrix/setup-matrix.component";
import { PlayerScoresFooterComponent } from "./views/game-page/player-scores-footer/player-scores-footer.component";
import { GameMatrixComponent } from "./views/game-page/game-matrix/game-matrix.component";
import { ScoreTableComponent } from "./views/result-page/score-table/score-table.component";
import { PodiumComponent } from "./views/result-page/podium/podium.component";
import { RoundsTableComponent } from "./views/result-page/rounds-table/rounds-table.component";

@NgModule({
  declarations: [
    AppComponent,
    GameSetupPageComponent,
    GamePageComponent,
    ResultPageComponent,
    SetupFormComponent,
    SetupMatrixComponent,
    PlayerScoresFooterComponent,
    GameMatrixComponent,
    ScoreTableComponent,
    PodiumComponent,
    RoundsTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
