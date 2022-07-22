import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { HomeComponent } from './home/home.component';
import { PokemonThumbnailComponent } from './pokemon-thumbnail/pokemon-thumbnail.component';
import { PokemonService } from './shared/pokemon-service';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { HallOfFameService } from './shared/hall-of-fame-service';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonDetailComponent,
    HomeComponent,
    PokemonThumbnailComponent,
    HallOfFameComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [PokemonService, HallOfFameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
