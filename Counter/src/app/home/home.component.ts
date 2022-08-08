import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../shared/pokemon-service';
import { Pokemon } from '../shared/pokemon';
import { Observable, take, map } from 'rxjs';
import { UserService } from '../shared/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pokemon!: Observable<Pokemon[]>;
  isFiltered$: Observable<boolean>;
  filterTerm$: Observable<string>;
  
  constructor(private pokemonService: PokemonService,
    private userService: UserService,
    private router: Router) {
    
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
    this.userService.getLogIn().pipe(
      take(1),
      map((isUser: boolean) => {
        if (!isUser) {
          this.router.navigate(['/notlogin'])
        }
      })
    ).subscribe();
  }

}
