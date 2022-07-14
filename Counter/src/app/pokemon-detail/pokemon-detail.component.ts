import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  name!: String
  pokemon: Pokemon = new Pokemon;
  pokemonList!: Pokemon[]

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.getName();
    this.getPokemon();
  }
  getName(): void {
    this.name = String(this.route.snapshot.paramMap.get('name'));
  }
  getPokemon() {
    this.pokemonList = this.pokemonService.getPokemon();
    let filteredList = this.pokemonList.find(pokemon => pokemon.name == this.name);
    if (filteredList) this.pokemon = filteredList;
  }

}
