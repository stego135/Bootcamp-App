import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, BehaviorSubject, switchMap, catchError, mergeMap } from 'rxjs';
import { Pokemon } from './pokemon';
import { POKEMON } from './pokemon-list';
import { ImageData } from './image';

@Injectable()
export class PokemonService {
    private filterStream: BehaviorSubject<string> = new BehaviorSubject("");
    public filter: Observable<string>;
    public pokemon: Observable<Pokemon[]>;
    private filteredStream: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public filtered: Observable<boolean>;
    private pokeUrl = 'api/pokemon';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http:HttpClient) { 
        this.pokemon = this.filterStream.pipe(
            switchMap(searchTerm => {
                if (!searchTerm) {
                    this.filteredStream.next(false);
                    return this.http.get<Pokemon[]>(this.pokeUrl);
                }
                else {
                    this.filteredStream.next(true);
                    return this.filterPokemon(searchTerm);
                }
            })
        )
        this.filtered = this.filteredStream.asObservable();
        this.filter = this.filterStream.asObservable();
    }
    
    getPokemon(): Observable<Pokemon[]> {
        return this.pokemon;
    }
    getOnePokemon(id: number): Observable<Pokemon> {
        const url = `${this.pokeUrl}/${id}`;
        return this.http.get<Pokemon>(url);
    }
    getImage(pokemon: Pokemon): Observable<string> {
        var lowerName = new String(pokemon.name);
        lowerName  = lowerName[0].toLowerCase() + lowerName.slice(1);
        lowerName = this.cleanName(lowerName);
        return this.http.get<ImageData>("https://pokeapi.co/api/v2/pokemon/" + lowerName).pipe(
            map((data: ImageData) => {
                return data.sprites.other.home.front_shiny;
            })
        );
    }
    removePokemon(id: number): Observable<Pokemon> {
        const url = `${this.pokeUrl}/${id}`;
        return this.http.delete<Pokemon>(url, this.httpOptions);
    }
    filterPokemon(searchTerm: string): Observable<Pokemon[]> {
        searchTerm = searchTerm.toLowerCase();
        return this.http.get<Pokemon[]>(this.pokeUrl).pipe(
            map((currentPokemon: Pokemon[]) => {
                return currentPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
            })
        );
    }
    changeTerm(searchTerm: string) {
        this.filterStream.next(searchTerm);
    }
    isFiltered(): Observable<boolean> {
        return this.filtered;
    }
    getSearchTerm(): Observable<string> {
        return this.filter;
    }
    addPokemon(pokemon: Pokemon): Observable<Pokemon> {
        return this.http.post<Pokemon>(this.pokeUrl, pokemon, this.httpOptions);
    }
    updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
        return this.http.put<Pokemon>(this.pokeUrl, pokemon, this.httpOptions);
    }
    cleanName(name: String): String {
        name = name[0].toLowerCase() + name.slice(1);
        switch(name) {
            case "nidoran":
                return name + "-m"
            case "meowstic":
            case "indeedee":
            case "basculegion":
                return name + "-male";
            case "farfetch'd":
                return "farfetchd";
            case "mr. Mime":
            case "mr. mime":
                return "mr-mime";
            case "ho-Oh":
                return "ho-oh";
            case "deoxys":
                return name + "-normal";
            case "wormadam":
                return name + "-plant";
            case "mime Jr.":
            case "mime jr.":
                return "mime-jr";
            case "porygon-Z":
                return "porygon-z";
            case "giratina":
                return name + "-altered";
            case "shaymin":
                return name + "-land";
            case "basculin":
                return name + "-red-striped";
            case "darmanitan":
            case "darmanitan-galar":
                return name + "-standard";
            case "meloetta":
                return name + "-aria";
            case "thundurus":
            case "tornadus":
            case "landorus":
                return name + "-incarnate";
            case "keldeo":
                return name + "-ordinary";
            case "flabébé":
                return "flabebe";
            case "aegislash":
                return name + "-shield"
            case "pumpkaboo":
            case "gourgeist":
                return name + "-average";
            case "zygarde":
                return name + "-50";
            case "oricorico":
                return name + "-baile";
            case "lycanroc":
                return name + "-midday";
            case "wishiwashi":
                return name + "-solo";
            case "type: Null":
            case "type: null":
                return "type-null";
            case "minior":
                return name + "-red-meteor";
            case "mimikyu":
                return name + "-disguised";
            case "tapu Lele":
            case "tapu lele":
                return "tapu-lele";
            case "tapu Koko":
            case "tapu koko":
                return "tapu-koko";
            case "tapu Bulu":
            case "tapu bulu":
                return "tapu-bulu";
            case "tapu Fini":
            case "tapu fini":
                return "tapu-fini";
            case "toxtricity":
                return name + "-amped";
            case "mr. Rime":
                return "mr-rime";
            case "sirfetch'd":
                return "sirfetchd";
            case "eiscue":
                return name + "-ice";
            case "morpeko":
                return name + "-full-belly";
            case "ursifu":
                return name + "-single-strike";
        }
        return name;
    }

    checkNewPokemon(pokemon: Pokemon): Observable<string> {
        return this.http.get<Pokemon[]>(this.pokeUrl).pipe(
            map((pokeList: Pokemon[]) => {
                var search = pokeList.find(searchPokemon => searchPokemon.name == pokemon.name);
                if (search != undefined) return true;
                else return false;
            }),
            mergeMap((isDup: boolean) => {
                if (isDup) return of("duplicate");
                var name = this.cleanName(pokemon.name);
                return this.http.get("https://pokeapi.co/api/v2/pokemon/" + name).pipe(
                    map(_ => {return "add";}),
                    catchError(_ => {return of("not");})
                );
            }));
            /*
        var search = POKEMON.find(searchPokemon => searchPokemon.name == pokemon.name);
        if (search != undefined) return of("duplicate");
        var name = this.cleanName(pokemon.name);
        return this.http.get("https://pokeapi.co/api/v2/pokemon/" + name).pipe(
            map(_ => {return "add";}),
            catchError(_ => {return of("not");})
        )
        */
    }
}
