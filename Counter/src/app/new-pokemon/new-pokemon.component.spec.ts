import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';
import { UserService } from '../shared/user-service';

import { NewPokemonComponent } from './new-pokemon.component';

describe('NewPokemonComponent', () => {
  let component: NewPokemonComponent;
  let fixture: ComponentFixture<NewPokemonComponent>;
  let pokemonServiceStub: Partial<PokemonService> = {
    checkNewPokemon(pokemon: Pokemon): Observable<boolean> {
      return of(true);
    },
    addPokemon(pokemon: Pokemon): Observable<Pokemon> {
      return of({id: 1, name: "Venusaur", count: 400, userId: 1});
    }
  };
  let userServiceStub: Partial<UserService> = {
    getLogIn(): Observable<boolean> {
      return of(true);
    },
    getId(): Observable<number> {
      return of(1);
    }
  };
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPokemonComponent ],
      providers: [ { provide: PokemonService, useValue: pokemonServiceStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: Router, useValue: routerSpy } ],
      imports: [FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
