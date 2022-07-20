import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Pokemon } from './pokemon';
import { POKEMON } from './pokemon-list';

@Injectable()
export class PokemonService {
    getPokemon(): Observable<Pokemon[]> {
        return of(POKEMON);
    }
    getOnePokemon(name: string): Pokemon {
        let filteredList = POKEMON.find(pokemon => pokemon.name == name);
        if (filteredList) return filteredList;
        return new Pokemon;
    }
}