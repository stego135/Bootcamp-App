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
  filterTerm$: Observable<string>;
  
  constructor(private pokemonService: PokemonService) { 
    this.isFiltered$ = this.pokemonService.isFiltered();
    this.filterTerm$ = this.pokemonService.getSearchTerm();
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
