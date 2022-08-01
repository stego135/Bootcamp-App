import { Injectable } from '@angular/core';

import { Pokemon } from './pokemon';
import { SHINY } from './hall-of-fame-list';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';

@Injectable()
export class HallOfFameService {
    private sortedStream: BehaviorSubject<string> = new BehaviorSubject("time");
    public sortedBy: Observable<string>;
    public shiny: Observable<Pokemon[]>;
    public view: Observable<Pokemon[]>;

    constructor() {
        this.sortedBy = this.sortedStream.asObservable();
        this.shiny = of(SHINY);
        this.view = combineLatest([this.shiny, this.sortedBy]).pipe(
            map(([shiny, sort]) => { 
                return this.sortShiny(shiny, sort); })
        )
    }

    getShiny() {
        return this.view;
    }
    changePhrase(sortPhrase: string) {
        this.sortedStream.next(sortPhrase);
    }
    sortShiny(shiny: Pokemon[], sort: string) {
        switch(sort) {
            case "time" :
                return shiny.sort((a, b) => a.id - b.id);
            case "asc":
                return shiny.sort((a, b) => a.count - b.count);
            case "desc":
                return shiny.sort((a, b) => b.count - a.count);
        }
        return shiny;
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