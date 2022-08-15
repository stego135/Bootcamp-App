import { PokemonService } from "./pokemon-service";
import { Pokemon } from "./pokemon";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PokemonService);
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
});