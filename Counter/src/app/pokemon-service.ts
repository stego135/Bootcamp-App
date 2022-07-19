import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Pokemon } from './pokemon';
import { POKEMON } from './pokemon-list';

@Injectable()
export class PokemonService {
    constructor(private http:HttpClient) { }

    getPokemon() {
        return POKEMON;
    }
    getImage(pokemon: Pokemon): Observable<string> {
        var lowerName = new String(pokemon.name);
        lowerName  = lowerName[0].toLowerCase() + lowerName.slice(1);
        return this.http.get<JSON>("https://pokeapi.co/api/v2/pokemon/" + lowerName).pipe(
            map((data: JSON) => {
                const obj = JSON.parse(JSON.stringify(data));
                return (obj.sprites.other.home.front_shiny);
            })
        );
    }
}