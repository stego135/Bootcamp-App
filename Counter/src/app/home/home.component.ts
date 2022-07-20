import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon-service';
import { Pokemon } from '../pokemon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pokemon!: Observable<Pokemon[]>;

  
  constructor(private pokemonService: PokemonService) { }

  getPokemon() {
    this.pokemon = this.pokemonService.getPokemon();
  }

  ngOnInit(): void {
    this.getPokemon();
  }

}
