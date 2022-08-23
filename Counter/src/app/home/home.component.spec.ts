import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';
import { UserService } from '../shared/user-service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let pokemonServiceStub: Partial<PokemonService> = {
    isFiltered(): Observable<boolean> {
      return of(false);
    },
    getSearchTerm(): Observable<string> {
      return of("");
    },
    changeTerm(term: string) {},
    getPokemon(): Observable<Pokemon[]> {
      return of([{id: 1, name: "Venusaur", count: 400, userId: 1},
      {id: 2, name: "Oshawott", count: 24, userId: 1}]);
    }
  };
  let userServiceStub: Partial<UserService> = {
    getLogIn(): Observable<boolean> {
      return of(true);
    }
  };
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, ThumbnailStubComponent ],
      providers: [ { provide: PokemonService, useValue: pokemonServiceStub },
        { provide: UserService, useValue: userServiceStub } ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


@Component({selector: 'app-pokemon-thumbnail', template: ''})
class ThumbnailStubComponent {
  @Input()
  public pokemon!: Pokemon;
}