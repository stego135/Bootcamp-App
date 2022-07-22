import { Injectable } from '@angular/core';

import { Pokemon } from './pokemon';
import { SHINY } from './hall-of-fame-list';
import { of } from 'rxjs';

@Injectable()
export class HallOfFameService {
    getShiny() {
        return of(SHINY);
    }
    sortAsc() {
        return of(SHINY.slice().sort((a, b) => a.count - b.count));
    }
    sortDesc() {
        return of(SHINY.slice().sort((a, b) => b.count - a.count));
    }
    addPokemon(pokemon: Pokemon) {
        SHINY.push(pokemon);
    }
}