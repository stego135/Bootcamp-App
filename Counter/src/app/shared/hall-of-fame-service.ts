import { Injectable } from '@angular/core';

//import { Pokemon } from './pokemon';
import { SHINY } from './hall-of-fame-list';

@Injectable()
export class HallOfFameService {
    getShiny() {
        return SHINY;
    }
    sortAsc() {
        return SHINY.sort((a, b) => a.count - b.count);
    }
    sortDesc() {
        return SHINY.sort((a, b) => b.count - a.count);
    }
}