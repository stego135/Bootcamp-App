import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon-service';

@Component({
  selector: 'app-pokemon-thumbnail',
  templateUrl: './pokemon-thumbnail.component.html',
  styleUrls: ['./pokemon-thumbnail.component.css']
})
export class PokemonThumbnailComponent implements OnInit {

  @Input()
  pokemon: Pokemon = new Pokemon;
  image$!: Observable<string>;

  constructor(
    private pokemonService: PokemonService) {
  }

  ngOnInit(): void {
    this.getImageUrl();
  }

  getImageUrl() {
    this.image$ = this.pokemonService.getImage(this.pokemon);
    console.log(this.image$);
  }
  /*
special cases: nidoran, farfetch'd, mr mime, ho oh, deoxys, wormadam, 
mime jr, porygon z, giratina, shaymin, basculin, darmanitan, meloetta, 
genies, keldeo, aegislash, meowstic, pumpkaoo, gourgeist, zygarde, 
oricorio, lycanroc, wishiwashi, type null, minior, mimikyu, kommo-o, 
tapus, toxtricity, mr rime, sirfetch'd, eiscue, indeedee, morpeko, 
urshifu, basculegion

maybe add alola and galar option to form?
  */

}
