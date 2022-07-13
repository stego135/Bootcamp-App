import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { HomeComponent } from './home/home.component';
import { PokemonThumbnailComponent } from './pokemon-thumbnail/pokemon-thumbnail.component';
import { PokemonService } from './pokemon-service';

@NgModule({
  declarations: [
    AppComponent,
    PokemonDetailComponent,
    HomeComponent,
    PokemonThumbnailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [PokemonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
