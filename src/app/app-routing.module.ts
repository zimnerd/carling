import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";
import {SelectComponent} from "./select/select.component";
import {SelectPlayersComponent} from "./select-players/select-players.component";
import {ReadyComponent} from "./ready/ready.component";
import {ImageRenderComponent} from "./image-render/image-render.component";

const routes: Routes = [{path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'select', component: SelectComponent},
  {path: 'select-players/:team', component: SelectPlayersComponent},
  {path: 'ready/:set', component: ReadyComponent},
  {path: 'image-render/:background/:overlay', component: ImageRenderComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
