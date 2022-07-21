import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Pokemon } from './pokemon';
import { POKEMON } from './pokemon-list';
import { ImageData } from './image';

@Injectable()
export class PokemonService {
    constructor(private http:HttpClient) { }
    
    getPokemon(): Observable<Pokemon[]> {
        return of(POKEMON);
    }
    getOnePokemon(name: string): Pokemon {
        let filteredList = POKEMON.find(pokemon => pokemon.name == name);
        if (filteredList) return filteredList;
        return new Pokemon;
    }
    getImage(pokemon: Pokemon): Observable<string> {
        var lowerName = new String(pokemon.name);
        lowerName  = lowerName[0].toLowerCase() + lowerName.slice(1);
        return this.http.get<ImageData>("https://pokeapi.co/api/v2/pokemon/" + lowerName).pipe(
            map((data: ImageData) => {
                return data.sprites.other.home.front_shiny;
            })
        );
    }
    removePokemon(pokemon: Pokemon) {
        const index = POKEMON.indexOf(pokemon);
        POKEMON.splice(index, 1);
    }
}