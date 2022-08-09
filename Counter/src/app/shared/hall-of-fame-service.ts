import { Injectable } from '@angular/core';

import { Pokemon } from './pokemon';
import { BehaviorSubject, combineLatest, map, mergeMap, Observable, of, catchError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user-service';

@Injectable({
    providedIn: 'root',
  })
export class HallOfFameService {
    private sortedStream: BehaviorSubject<string> = new BehaviorSubject("time");
    public sortedBy: Observable<string>;
    private unfilteredShiny: Observable<Pokemon[]>
    public shiny: Observable<Pokemon[]>;
    public view: Observable<Pokemon[]>;
    private userId: Observable<number>;
    private shinyUrl = 'api/shiny';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient, private userService: UserService) {
        this.sortedBy = this.sortedStream.asObservable();
        this.userId = this.userService.getId();
        this.unfilteredShiny = this.http.get<Pokemon[]>(this.shinyUrl).pipe(
            catchError(this.handleError<Pokemon[]>('getShiny', []))
        )
        this.shiny = combineLatest([this.unfilteredShiny, this.userId]).pipe(
            map(([unfiltered, id]) => {
                return unfiltered.filter(pokemon => pokemon.userId == id);
            })
        )
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
        return this.unfilteredShiny.pipe(
            map((shiny: Pokemon[]) => {
                return shiny.length;
            }),
            mergeMap((length: number) => {
                pokemon.id = length + 1;
                return this.http.post<Pokemon>(this.shinyUrl, pokemon, this.httpOptions).pipe(
                    catchError(this.handleError<Pokemon>('addShiny'))
                );
            }))
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
    }
}