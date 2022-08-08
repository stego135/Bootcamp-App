import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { HomeComponent } from './home/home.component';
import { PokemonThumbnailComponent } from './pokemon-thumbnail/pokemon-thumbnail.component';
import { PokemonService } from './shared/pokemon-service';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { HallOfFameService } from './shared/hall-of-fame-service';
import { NavbarComponent } from './navbar/navbar.component';
import { NewPokemonComponent } from './new-pokemon/new-pokemon.component';
import { InMemoryDataService } from './shared/in-memory-data.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { UserService } from './shared/user-service';
import { LoginErrorComponent } from './login-error/login-error.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonDetailComponent,
    HomeComponent,
    PokemonThumbnailComponent,
    HallOfFameComponent,
    NavbarComponent,
    NewPokemonComponent,
    PageNotFoundComponent,
    LoginFormComponent,
    LoginErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false,
        passThruUnknownUrl: true }
    )
  ],
  providers: [PokemonService, HallOfFameService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
