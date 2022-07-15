import { Component, OnInit, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Pokemon } from '../pokemon';
import { Data } from '@angular/router';

@Component({
  selector: 'app-pokemon-thumbnail',
  templateUrl: './pokemon-thumbnail.component.html',
  styleUrls: ['./pokemon-thumbnail.component.css']
})
export class PokemonThumbnailComponent implements OnInit {

  @Input()
  pokemon: Pokemon = new Pokemon;
  image!: String;

  constructor(private http:HttpClient) {
  }

  ngOnInit(): void {
    this.getImageUrl();
  }

  getImageUrl() {
    var lowerName = new String(this.pokemon.name);
    lowerName  = lowerName[0].toLowerCase() + lowerName.slice(1);
    this.http.get<Data>("https://pokeapi.co/api/v2/pokemon/" + lowerName).subscribe(data=> {
      this.image = data['sprites'].other.home.front_shiny;
    });
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
