import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../shared/pokemon-service';
import { Pokemon } from '../shared/pokemon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pokemon!: Observable<Pokemon[]>;
  isFiltered$: Observable<boolean>;

  
  constructor(private pokemonService: PokemonService) { 
    this.isFiltered$ = this.pokemonService.isFiltered();
  }

  getPokemon() {
    this.pokemon = this.pokemonService.getPokemon();
  }

  clearSearch() {
    this.pokemonService.changeTerm("");
  }

  ngOnInit(): void {
    this.getPokemon();
  }

}
