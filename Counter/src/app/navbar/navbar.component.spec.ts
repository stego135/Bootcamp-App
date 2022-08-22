import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PokemonService } from '../shared/pokemon-service';
import { UserService } from '../shared/user-service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let userSpy = jasmine.createSpyObj('UserService', ['getLogIn', 'logOut']);
  let pokemonSpy = jasmine.createSpyObj('PokemonService', ['changeTerm']);

  let isLoggedInStream = new BehaviorSubject(true);
  userSpy.getLogIn.and.returnValue(isLoggedInStream.asObservable());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ NavbarComponent ],
      providers: [ { provide: UserService, useValue: userSpy }, 
        { provide: Router, useValue: routerSpy },
        { provide: PokemonService, useValue: pokemonSpy } ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navbar search', () => {

    it('should route to new page', () => {
      let searchButton = fixture.debugElement.nativeElement.querySelector('#search');
      searchButton.click();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    }),

    it('should call pokemon service to change the term', () => {
      let searchButton = fixture.debugElement.nativeElement.querySelector('#search');
      let searchBox = fixture.debugElement.nativeElement.querySelector('#searchBox');
      searchBox.value = 'Bulbasaur';
      searchBox.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      searchButton.click();

      expect(pokemonSpy.changeTerm).toHaveBeenCalledWith('Bulbasaur');
    }),

    it('should reset the search term in the search bar', fakeAsync(() => {
      let searchButton = fixture.debugElement.nativeElement.querySelector('#search');
      let searchBox = fixture.debugElement.nativeElement.querySelector('#searchBox');
      searchBox.value = 'Bulbasaur';
      searchBox.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.searchTerm).toEqual('Bulbasaur');
      expect(searchBox.value).toEqual('Bulbasaur');

      searchButton.click();
      fixture.detectChanges();
      tick();

      expect(component.searchTerm).toEqual('');
      expect(searchBox.value).toEqual('');
    }))
  })

  describe('Log in and log out buttons', () => {

    it('should display the correct button when logged in', fakeAsync(() => {
      isLoggedInStream.next(true);
      fixture.detectChanges();
      tick();

      expect(fixture.debugElement.nativeElement.querySelector('.log-button').textContent).toEqual('Log Out')
    })),

    it('should display the correct button when logged out', fakeAsync(() => {
      isLoggedInStream.next(false);
      fixture.detectChanges();
      tick();

      expect(fixture.debugElement.nativeElement.querySelector('.log-button').textContent).toEqual('Log In')
    }))
  })

  describe('Logging in and out', () => {

    it('should link to the log in page if logged out', fakeAsync(() => {
      isLoggedInStream.next(false);
      fixture.detectChanges();
      tick();

      let logInButton = fixture.debugElement.nativeElement.querySelector('.log-button');

      expect(logInButton.getAttribute('routerLink')).toEqual('/login');
    })),

    it('should properly log out when logged in', fakeAsync(() => {
      isLoggedInStream.next(true);
      fixture.detectChanges();
      tick();

      let logInButton = fixture.debugElement.nativeElement.querySelector('.log-button');

      logInButton.click();

      expect(userSpy.logOut).toHaveBeenCalled();
      expect(component.searchTerm).toEqual('');
      expect(pokemonSpy.changeTerm).toHaveBeenCalledWith('');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/intro']);
    }))
  })

  describe('Routing', () => {

    it('should correctly link to the intro page', () => {
      let brand = fixture.debugElement.nativeElement.querySelector('.navbar-brand');

      expect(brand.getAttribute('routerLink')).toEqual('/intro');
    }),

    it('should correctly link to the home page', () => {
      let home = fixture.debugElement.nativeElement.querySelector('#home');

      expect(home.getAttribute('routerLink')).toEqual('/home');
    }),
    it('should correctly link to the hall of fame page', () => {
      let hall = fixture.debugElement.nativeElement.querySelector('#hall');

      expect(hall.getAttribute('routerLink')).toEqual('/hall');
    })
  })
});
