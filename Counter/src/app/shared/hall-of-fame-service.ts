import { Injectable } from '@angular/core';

import { Pokemon } from './pokemon';
import { SHINY } from './hall-of-fame-list';
import { BehaviorSubject, combineLatest, map, mergeMap, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HallOfFameService {
    private sortedStream: BehaviorSubject<string> = new BehaviorSubject("time");
    public sortedBy: Observable<string>;
    public shiny: Observable<Pokemon[]>;
    public view: Observable<Pokemon[]>;
    private shinyUrl = 'api/shiny';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) {
        this.sortedBy = this.sortedStream.asObservable();
        this.shiny = this.http.get<Pokemon[]>(this.shinyUrl);
        this.view = combineLatest([this.shiny, this.sortedBy]).pipe(
            map(([shiny, sort]) => { 
                return this.sortShiny(shiny, sort); })
        )
    }

    getShiny(): Observable<Pokemon[]> {
        return this.view;
    }
    changePhrase(sortPhrase: string) {
        this.sortedStream.next(sortPhrase);
    }
    sortShiny(shiny: Pokemon[], sort: string): Pokemon[] {
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
    addPokemon(pokemon: Pokemon): Observable<Pokemon> {
        return this.shiny.pipe(
            map((shiny: Pokemon[]) => {
                return shiny.length;
            }),
            mergeMap((length: number) => {
                pokemon.id = length;
                return this.http.post<Pokemon>(this.shinyUrl, pokemon, this.httpOptions);
            }))
    }
}