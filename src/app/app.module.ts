import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameSetupPageComponent } from './views/game-setup-page/game-setup-page.component';
import { GamePageComponent } from './views/game-page/game-page.component';
import { ResultPageComponent } from './views/result-page/result-page.component';

@NgModule({
  declarations: [
    AppComponent,
    GameSetupPageComponent,
    GamePageComponent,
    ResultPageComponent
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
