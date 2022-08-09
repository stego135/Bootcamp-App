import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take, map, mergeMap, tap, of } from 'rxjs';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';

@Component({
  selector: 'app-new-pokemon',
  templateUrl: './new-pokemon.component.html',
  styleUrls: ['./new-pokemon.component.css']
})
export class NewPokemonComponent implements OnInit {
  count:number = 0;
  name!:string;
  mouseOver:boolean = false;
  dupAlert = false;
  notAlert = false;

  constructor(private pokemonService: PokemonService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(formValues: Pokemon) {
    this.dupAlert = false;
    this.notAlert = false;
    formValues.name = formValues.name[0].toUpperCase() + formValues.name.slice(1);
    this.pokemonService.checkNewPokemon(formValues).pipe(
      take(1),
      mergeMap((value: string) => {
        if (value == "add") {
          return this.pokemonService.addPokemon(formValues);
        }
        else if (value == "duplicate") {
          this.dupAlert = true;
          return of(null);
        }
        else {
          this.notAlert = true;
          return of(null);
        }
      })).subscribe(result => {
        if (result == true) this.router.navigate(['/home']);
      });
    }
}
