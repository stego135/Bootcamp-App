import { Injectable } from '@angular/core';

import { Pokemon } from './pokemon';
import { SHINY } from './hall-of-fame-list';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class HallOfFameService {
    getShiny() {
        return of(SHINY);
    }
    sortAsc() {
        return of(SHINY.sort((a, b) => a.count - b.count));
    }
    sortDesc() {
        return of(SHINY.sort((a, b) => b.count - a.count));
    }
    sortOrder() {
        return of(SHINY.sort((a, b) => a.id - b.id));
    }
    addPokemon(pokemon: Pokemon): Observable<boolean> {
       const oldLength = SHINY.length;
       pokemon.id = oldLength + 1;
       return of(SHINY.push(pokemon)).pipe(
        map((length: Number) => {
            return length > oldLength;
        }
       ));
    }
}