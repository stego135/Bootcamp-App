import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { HomeComponent } from './home/home.component';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { NewPokemonComponent } from './new-pokemon/new-pokemon.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginErrorComponent } from './login-error/login-error.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { IntroComponent } from './intro/intro.component';

const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'intro', component: IntroComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'home', component: HomeComponent },
  { path: 'detail/:id', component: PokemonDetailComponent },
  { path: 'hall', component: HallOfFameComponent },
  { path: 'new', component: NewPokemonComponent },
  { path: 'notlogin', component: LoginErrorComponent},
  { path: 'newaccount', component: CreateAccountComponent},
  { path: 'error', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
