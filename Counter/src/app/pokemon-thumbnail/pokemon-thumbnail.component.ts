import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';

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
  }
}
