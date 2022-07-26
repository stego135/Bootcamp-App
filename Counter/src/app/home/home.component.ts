import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../shared/pokemon-service';
import { Pokemon } from '../shared/pokemon';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pokemon!: Observable<Pokemon[]>;

  
  constructor(private pokemonService: PokemonService,
    private route: ActivatedRoute) { }

  getPokemon() {
    this.pokemon = this.pokemonService.getPokemon();
  }

  getFilteredPokemon(searchTerm: string) {
    this.pokemon = this.pokemonService.filterPokemon(searchTerm);
  }

  loadPokemon(searchTerm: string) {
    if (searchTerm == null) {
      this.getPokemon();
    }
    else {
      this.getFilteredPokemon(searchTerm);
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => this.loadPokemon(routeParams['search']));
  }

}
