import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, BehaviorSubject, switchMap } from 'rxjs';
import { Pokemon } from './pokemon';
import { POKEMON } from './pokemon-list';
import { ImageData } from './image';

@Injectable()
export class PokemonService {
    private filterStream: BehaviorSubject<string> = new BehaviorSubject("");
    public pokemon: Observable<Pokemon[]>;
    private filteredStream: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public filtered: Observable<boolean>;

    constructor(private http:HttpClient) { 
        this.pokemon = this.filterStream.pipe(
            switchMap(searchTerm => {
                if (!searchTerm) {
                    this.filteredStream.next(false);
                    return of(POKEMON);
                }
                else {
                    this.filteredStream.next(true);
                    return this.filterPokemon(searchTerm);
                }
            })
        )
        this.filtered = this.filteredStream.asObservable();
    }
    
    getPokemon(): Observable<Pokemon[]> {
        return this.pokemon;
    }
    getOnePokemon(id: number): Pokemon {
        let filteredList = POKEMON.find(pokemon => pokemon.id == id);
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
    removePokemon(pokemon: Pokemon): Observable<boolean> {
        const index = POKEMON.indexOf(pokemon);
        return of(POKEMON.splice(index, 1)).pipe(
            map((deleted: Pokemon[]) => {
                return deleted.length > 0;
            })
        )
    }
    filterPokemon(searchTerm: string): Observable<Pokemon[]> {
        return of(POKEMON.filter(pokemon => pokemon.name.includes(searchTerm)));
    }
    changeTerm(searchTerm: string) {
        this.filterStream.next(searchTerm);
    }
    isFiltered(): Observable<boolean> {
        return this.filtered;
    }
}