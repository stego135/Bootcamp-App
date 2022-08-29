import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';
import { UserService } from '../shared/user-service';

import { NewPokemonComponent } from './new-pokemon.component';

describe('NewPokemonComponent', () => {
  let component: NewPokemonComponent;
  let fixture: ComponentFixture<NewPokemonComponent>;
  let pokemonSpy = jasmine.createSpyObj('PokemonService', ['checkNewPokemon', 'addPokemon']);
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
      providers: [ { provide: PokemonService, useValue: pokemonSpy },
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

  describe('submit', () => {
    it('should not create a pokemon if not valid', () => {
      pokemonSpy.checkNewPokemon.and.returnValue(of(false));
      pokemonSpy.addPokemon.calls.reset();
      pokemonSpy.checkNewPokemon.calls.reset();

      component.onSubmit(<Pokemon>{name: 'test', count: 0});

      expect(pokemonSpy.checkNewPokemon).toHaveBeenCalled();
      expect(pokemonSpy.addPokemon).not.toHaveBeenCalled();
    })

    it('should display an error if the pokemon does not exist', () => {
      pokemonSpy.checkNewPokemon.and.returnValue(of(false));

      component.onSubmit(<Pokemon>{name: 'test', count: 0});
      fixture.detectChanges();

      let alert = fixture.debugElement.query(By.css('.alert-danger'));
      expect(alert).toBeTruthy();
    })

    it('should add a pokemon if correct', () => {
      pokemonSpy.checkNewPokemon.and.returnValue(of(true));
      pokemonSpy.addPokemon.and.returnValue(of({id: 1, name: 'Pikachu', count: 0, userId: 1}))
      pokemonSpy.addPokemon.calls.reset();
      pokemonSpy.checkNewPokemon.calls.reset();

      component.onSubmit(<Pokemon>{name: 'Pikachu', count: 0});

      expect(pokemonSpy.checkNewPokemon).toHaveBeenCalled();
      expect(pokemonSpy.addPokemon).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    })
  })
});
