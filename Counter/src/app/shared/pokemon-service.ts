import { Injectable } from '@angular/core';
import { Pokemon } from './pokemon';

//import { Pokemon } from './pokemon';
import { POKEMON } from './pokemon-list';

@Injectable()
export class PokemonService {
    getPokemon() {
        return POKEMON;
    }
    removePokemon(pokemon: Pokemon) {
        const index = POKEMON.indexOf(pokemon);
        POKEMON.splice(index, 1);
    }
}