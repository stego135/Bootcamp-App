import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon-service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  name!: String
  pokemon: Pokemon = new Pokemon;
  pokemonList!: Pokemon[]
  data: any

  constructor(private route: ActivatedRoute, 
    private pokemonService: PokemonService,
    private http:HttpClient,
    private location: Location) { }

  ngOnInit(): void {
    this.getName();
    this.getPokemon();
    this.getImageUrl();
  }
  getName(): void {
    this.name = String(this.route.snapshot.paramMap.get('name'));
  }
  getPokemon() {
    this.pokemonList = this.pokemonService.getPokemon();
    let filteredList = this.pokemonList.find(pokemon => pokemon.name == this.name);
    if (filteredList) this.pokemon = filteredList;
  }
  getImageUrl() {
    var lowerName = new String(this.pokemon.name);
    lowerName  = lowerName[0].toLowerCase() + lowerName.slice(1);
    this.http.get("https://pokeapi.co/api/v2/pokemon/" + lowerName).subscribe(data=> {
      this.data = data;
    });
  }
  add() {
    this.pokemon.count+=1;
  }
  goBack(): void {
    this.location.back();
  }

}
