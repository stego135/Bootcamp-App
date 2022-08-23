import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HallOfFameService } from '../shared/hall-of-fame-service';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';
import { UserService } from '../shared/user-service';

import { PokemonDetailComponent } from './pokemon-detail.component';

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let routeSpy = {snapshot: {
    paramMap: convertToParamMap({
      id: '1'
    })
  }};
  let userServiceStub: Partial<UserService> = {
    getLogIn(): Observable<boolean> {
      return of(true);
    },
    getId(): Observable<number> {
      return of(1);
    }
  };
  let pokemonServiceStub: Partial<PokemonService> = {
    getOnePokemon(): Observable<Pokemon> {
      return of({id: 1, name: "Venusaur", count: 400, userId: 1});
    },
    getImage(): Observable<string> {
      return of("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/3.png");
    },
    updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
      return of({id: 1, name: "Venusaur", count: 401, userId: 1});
    },
    removePokemon(id: number): Observable<Pokemon> {
      return of();
    }
  };
  let hallServiceStub: Partial<HallOfFameService> = {
    addPokemon(pokemon: Pokemon): Observable<Pokemon> {
      return of({id: 1, name: "Venusaur", count: 400, userId: 1});
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ PokemonDetailComponent ],
      providers: [ { provide: PokemonService, useValue: pokemonServiceStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: HallOfFameService, useValue: hallServiceStub } ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
