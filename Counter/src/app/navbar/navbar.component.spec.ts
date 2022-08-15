import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PokemonService } from '../shared/pokemon-service';
import { UserService } from '../shared/user-service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let userServiceStub: Partial<UserService> = {
    getLogIn(): Observable<boolean> {
      return of(true);
    },
    logOut() {}
  };
  let pokemonServiceStub: Partial<PokemonService> = {
    changeTerm(term: string) {}
  };
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [ { provide: UserService, useValue: userServiceStub }, 
        { provide: Router, useValue: routerSpy },
        { provide: PokemonService, useValue: pokemonServiceStub } ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
