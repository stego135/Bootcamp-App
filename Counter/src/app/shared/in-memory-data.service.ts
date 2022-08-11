import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Pokemon } from './pokemon';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const pokemon = [
        {id: 1, name: "Venusaur", count: 400},
        {id: 2, name: "Oshawott", count: 24},
        {id: 3, name: "Mew", count: 5025},
        {id: 4, name: "Liepard", count: 1234},
        {id: 5, name: "Naganadel", count: 2845}
    ]
    const shiny = [
        {name: "Raticate", count: 3, id: 1},
        {name: "Audino", count: 4914, id: 2},
        {name: "Cresselia", count: 3629, id: 3},
        {name: "Axew", count: 497, id: 4},
        {name: "Regieleki", count: 6310, id: 5},
        {name: "Toxel", count: 2174, id: 6},
        {name: "Yungoos", count: 87, id: 7},
        {name: "Latios", count: 635, id: 8}
    ]
    return {pokemon, shiny};
  }
  genId(pokemon: Pokemon[]): number {
    return pokemon.length > 0 ? Math.max(...pokemon.map(pokemon => pokemon.id)) + 1 : 1;
  }
}
