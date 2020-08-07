import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GameSetupPageComponent } from "./views/game-setup-page/game-setup-page.component";
import { GamePageComponent } from "./views/game-page/game-page.component";
import { ResultPageComponent } from "./views/result-page/result-page.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: GameSetupPageComponent,
  },
  {
    path: "game",
    component: GamePageComponent,
  },
  {
    path: "result",
    component: ResultPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
