import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  name!: string
  pokemon: Pokemon = new Pokemon;
  pokemonList!: Observable<Pokemon[]>
  image$!: Observable<string>;

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
    this.pokemon = this.pokemonService.getOnePokemon(this.name);
  }
  getImageUrl() {
    this.image$ = this.pokemonService.getImage(this.pokemon);
  }
  add() {
    this.pokemon.count+=1;
  }
  goBack(): void {
    this.location.back();
  }

}
