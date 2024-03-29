import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take, mergeMap, of, map, combineLatest } from 'rxjs';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';
import { UserService } from '../shared/user-service';

@Component({
  selector: 'app-new-pokemon',
  templateUrl: './new-pokemon.component.html',
  styleUrls: ['./new-pokemon.component.css']
})
export class NewPokemonComponent implements OnInit {
  count:number = 0;
  name!:string;
  mouseOver:boolean = false;
  notAlert:boolean = false;

  constructor(private pokemonService: PokemonService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getLogIn().pipe(
      take(1),
      map((isUser: boolean) => {
        if (!isUser) {
          this.router.navigate(['/notlogin'])
        }
      })
    ).subscribe();
  }

  onSubmit(formValues: Pokemon) {
    this.notAlert = false;
    formValues.name = formValues.name[0].toUpperCase() + formValues.name.slice(1);
    combineLatest([this.pokemonService.checkNewPokemon(formValues), this.userService.getId()]).pipe(
      take(1),
      mergeMap(([isPokemon, userId]) => {
        if (isPokemon) {
          formValues.userId = userId;
          return this.pokemonService.addPokemon(formValues);
        }
        else {
          this.notAlert = true;
          return of(null);
        }
      })).subscribe(result => {
        if (result != null) this.router.navigate(['/home']);
      });
  }
}
