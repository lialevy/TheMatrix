import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameSetupPageComponent } from './views/game-setup-page/game-setup-page.component';
import { GamePageComponent } from './views/game-page/game-page.component';
import { ResultPageComponent } from './views/result-page/result-page.component';
import { SetupFormComponent } from './views/game-setup-page/setup-form/setup-form.component';
import { SetupMatrixComponent } from './views/game-setup-page/setup-matrix/setup-matrix.component';
import { PlayerScoresFooterComponent } from './views/game-page/player-scores-footer/player-scores-footer.component';
import { GameMatrixComponent } from './views/game-page/game-matrix/game-matrix.component';
import { ScoreTableComponent } from './views/result-page/score-table/score-table.component';
import { PodiumComponent } from './views/result-page/podium/podium.component';
import { RoundsTableComponent } from './views/result-page/rounds-table/rounds-table.component';

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
    RoundsTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
