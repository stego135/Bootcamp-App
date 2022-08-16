import { PokemonService } from "./pokemon-service";
import { Pokemon } from "./pokemon";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from "./user-service";
import { Observable, of } from "rxjs";

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
    })
  })
});