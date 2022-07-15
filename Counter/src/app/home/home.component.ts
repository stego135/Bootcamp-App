import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../shared/pokemon-service';
import { Pokemon } from '../shared/pokemon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pokemon!: Pokemon[]

  
  constructor(private pokemonService: PokemonService) { }

  getPokemon() {
    this.pokemon = this.pokemonService.getPokemon();
  }

  ngOnInit(): void {
    this.getPokemon();
  }

}
