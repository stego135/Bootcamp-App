import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Pokemon } from './pokemon';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const pokemon = [
        {id: 1, name: "Venusaur", count: 400, userId: 1},
        {id: 2, name: "Oshawott", count: 24, userId: 1},
        {id: 3, name: "Mew", count: 5025, userId: 1},
        {id: 4, name: "Liepard", count: 1234, userId: 2},
        {id: 5, name: "Naganadel", count: 2845, userId: 2}
    ]
    const shiny = [
        {id: 1, name: "Raticate", count: 3, userId: 1},
        {id: 2, name: "Audino", count: 4914, userId: 1},
        {id: 3, name: "Cresselia", count: 3629, userId: 1},
        {id: 4, name: "Axew", count: 497, userId: 1},
        {id: 5, name: "Regieleki", count: 6310, userId: 2},
        {id: 6, name: "Toxel", count: 2174, userId: 2},
        {id: 7, name: "Yungoos", count: 87, userId: 2},
        {id: 8, name: "Latios", count: 635, userId: 2}
    ]
    const user = [
        {id: 1, userName: "test", email: "test@test.com", password: "test"}
    ]
    return {pokemon, shiny, user};
  }
  genId<T extends Pokemon | User>(array: T[]): number {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
  }
}
