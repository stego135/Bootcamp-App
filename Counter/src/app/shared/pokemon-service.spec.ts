import { PokemonService } from "./pokemon-service";
import { Pokemon } from "./pokemon";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from "./user-service";
import { map, Observable, of, mergeMap, BehaviorSubject, take } from "rxjs";

describe('PokemonService', () => {
  let service: PokemonService;
  
  let mockHttp: HttpTestingController;

  let userServiceStub: Partial<UserService> = {
    getId(): Observable<number> {
      return of(1);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ { provide: UserService, useValue: userServiceStub } ]
    });
    service = TestBed.inject(PokemonService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cleanName', () => {

    it('should make name lower case', () => {
        var pokemonName = "Bulbasaur";
        var newName = service.cleanName(pokemonName);
        expect(newName).toBe("bulbasaur");
    })

    it('should add string to incomplete name', () => {
        var pokemonName = "Toxtricity";
        var newName = service.cleanName(pokemonName);
        expect(newName).toBe("toxtricity-amped")
    })

    it('should correctly apply changes to fall-through cases', () => {
        var thundurus = "thundurus";
        var tornadus = "tornadus";
        var landorus = "landorus";
        var enamorus = "enamorus";

        var newThundurus = service.cleanName(thundurus);
        var newTornadus = service.cleanName(tornadus);
        var newLandorus = service.cleanName(landorus);
        var newEnamorus = service.cleanName(enamorus);

        expect(newThundurus).toBe("thundurus-incarnate");
        expect(newTornadus).toBe("tornadus-incarnate");
        expect(newLandorus).toBe("landorus-incarnate");
        expect(newEnamorus).toBe("enamorus-incarnate");
    })
  })

  describe('getPokemon', () => {

    it('should return pokemon', () => {
      const testData = [{id: 1, name: "Venusaur", count: 400, userId: 1},
      {id: 2, name: "Oshawott", count: 24, userId: 1},
      {id: 3, name: "Mew", count: 5025, userId: 1}];

      service.getPokemon().subscribe(data => {
        expect(data).toEqual(testData);
        expect(data.length).toBe(3);
      });

      const req = mockHttp.expectOne('api/pokemon');
      expect(req.request.url).toEqual('api/pokemon');
      expect(req.request.method).toBe('GET');

      req.flush(testData);
    }),

    describe('should return different pokemon depending on userId', () => {
      let idStream = new BehaviorSubject(0);
      const testData = [{id: 1, name: "Venusaur", count: 400, userId: 1},
      {id: 2, name: "Oshawott", count: 24, userId: 1},
      {id: 3, name: "Mew", count: 5025, userId: 1},
      {id: 4, name: "Liepard", count: 1234, userId: 2},
      {id: 5, name: "Naganadel", count: 2845, userId: 2}];
      const returnData2 = [{id: 4, name: "Liepard", count: 1234, userId: 2},
      {id: 5, name: "Naganadel", count: 2845, userId: 2}];
      const returnData1 = [{id: 1, name: "Venusaur", count: 400, userId: 1},
      {id: 2, name: "Oshawott", count: 24, userId: 1},
      {id: 3, name: "Mew", count: 5025, userId: 1}];

      let httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      httpClientSpy.get.and.returnValue(of(testData));
      let userServiceSpy = jasmine.createSpyObj('UserService', ['getId']);
      userServiceSpy.getId.and.returnValue(idStream.asObservable());
      let newService = new PokemonService(httpClientSpy, userServiceSpy);

      it('should return certain values for userid 1', () => {
        idStream.next(1);
        newService.getPokemon().pipe(
          take(1),
          map(result => {
            expect(result).toEqual(returnData1);
            expect(result.length).toBe(3);
          })
        ).subscribe()
      })

      it('should return certain values for userId 2', () => {
        idStream.next(2);
        newService.getPokemon().pipe(
          take(1),
          map(result => {
            expect(result).toEqual(returnData2);
            expect(result.length).toBe(2);
          })
        ).subscribe();
      })
    })
  })

  describe('getOnePokemon', () => {

    it('should retrieve correct pokemon', () => {
      const testPokemon = {id: 3, name: "Mew", count: 5025, userId: 1};
      const id = 3;
      const testUrl = `api/pokemon/${id}`

      service.getOnePokemon(id).subscribe(data => {
        expect(data).toEqual(testPokemon);
      });

      const req = mockHttp.expectOne('api/pokemon/3');
      expect(req.request.url).toEqual(testUrl);
      expect(req.request.method).toBe('GET');

      req.flush(testPokemon);
    }),

    it('should return empty object for invalid id', () => {
      const wrongId = 0;

      service.getOnePokemon(wrongId).subscribe(data => {
        expect(data).toBeNull();
      })

      const req = mockHttp.expectOne('api/pokemon/0');

      req.flush(null);
    })
  })

  describe('deletePokemon', () => {
    it('should remove pokemon from the list', () => {
      const id = 1;

      service.removePokemon(id).subscribe(result => {
        expect(result).toBeNull();
      });

      const req = mockHttp.expectOne('api/pokemon/1');
      expect(req.request.method).toBe('DELETE');

      req.flush(null);
    }),

    it('should not delete anything with an incorrect id', () => {
      const id = 0;

      service.removePokemon(id).subscribe(result => {
        expect(result).toBeNull();
      });

      const req = mockHttp.expectOne('api/pokemon/0');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    })
  })

  describe('addPokemon', () => {

    it('should add a Pokemon to the list', () => {
      const newPokemon = {id: 6, name: "Mewtwo", count: 50, userId: 1};
      const testData = [{id: 1, name: "Venusaur", count: 400, userId: 1},
      {id: 2, name: "Oshawott", count: 24, userId: 1},
      {id: 3, name: "Mew", count: 5025, userId: 1},
      {id: 6, name: "Mewtwo", count: 50, userId: 1}];

      service.addPokemon(newPokemon).subscribe(result => {
        expect(result).toEqual(newPokemon);
      });

      const req = mockHttp.expectOne('api/pokemon');
      expect(req.request.method).toBe('POST');
      req.flush(newPokemon);
    })
  })

  describe('updatePokemon', () => {

    it('should correctly update Pokemon', () => {
      const pokemon = {id: 1, name: "Venusaur", count: 450, userId: 1};

      service.updatePokemon(pokemon).subscribe(result => {
        expect(result).toEqual(pokemon);
      });

      const req = mockHttp.expectOne('api/pokemon');
      expect(req.request.method).toBe('PUT');
      req.flush({id: 1, name: "Venusaur", count: 450, userId: 1});
    })
  }),

  describe('filterPokemon', () => {

    it('should return an array of Pokemon with names that include the search term', () => {
      let searchTerm = "a";
      const testData = [{id: 1, name: "Venusaur", count: 450, userId: 1},
      {id: 2, name: "Oshawott", count: 24, userId: 1},
      {id: 3, name: "Mew", count: 5025, userId: 1}];
      const returnData = [{id: 1, name: "Venusaur", count: 450, userId: 1},
      {id: 2, name: "Oshawott", count: 24, userId: 1}];

      service.filterPokemon(searchTerm, 1).pipe(
        take(1),
        map(result => {
          expect(result).toEqual(returnData);
          expect(result.length).toEqual(2);
        })
      ).subscribe();

      const req = mockHttp.expectOne('api/pokemon');
      expect(req.request.method).toBe('GET');
      req.flush(testData);
    }),

    it('should return an empty array if no Pokemon match', () => {
      let searchTerm = "noMatching";
      const testData = [{id: 1, name: "Venusaur", count: 450, userId: 1},
      {id: 2, name: "Oshawott", count: 24, userId: 1},
      {id: 3, name: "Mew", count: 5025, userId: 1}];

      service.filterPokemon(searchTerm, 1).pipe(
        take(1),
        map(result => {
          expect(result.length).toEqual(0);
        })
      ).subscribe();

      const req = mockHttp.expectOne('api/pokemon');
      expect(req.request.method).toBe('GET');
      req.flush(testData);
    })
  })

  describe("filterStreams", () => {

    it('should return the proper search term', () => {
      service.changeTerm('');

      service.getSearchTerm().pipe(
        take(1),
        map(result => {
          expect(result).toBe('');
        })
      ).subscribe();
    }),

    it('should change the search term correctly', () => {
      service.changeTerm("Bulbasaur");

      service.getSearchTerm().pipe(
        take(1),
        map(result => {
          expect(result).toBe('Bulbasaur');
        })
      ).subscribe();
    }),

    it('should return if the list is filtered or not', () => {
      service.changeTerm('');

      service.isFiltered().pipe(
        take(1),
      ).subscribe(result => {
        expect(result).toBeFalse();
      })
    })
  })
});