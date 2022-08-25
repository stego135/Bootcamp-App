import { Component, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, map, Observable, of, take } from 'rxjs';
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
  let loggedIn = new BehaviorSubject(true);
  let userServiceStub: Partial<UserService> = {
    getLogIn(): Observable<boolean> {
      return loggedIn.asObservable();
    }
  };
  let router: Router;
  let pokemonSpy = jasmine.createSpyObj('PokemonService', ['isFiltered', 'getSearchTerm', 'getPokemon', 'changeTerm']);
  let filterStream = new BehaviorSubject(false);
  let termStream = new BehaviorSubject('');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, ThumbnailStubComponent ],
      providers: [ { provide: PokemonService, useValue: pokemonSpy },
        { provide: UserService, useValue: userServiceStub } ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();

    pokemonSpy.getPokemon.and.returnValue(of([{id: 1, name: "Venusaur", count: 400, userId: 1},
    {id: 2, name: "Oshawott", count: 24, userId: 1}]));
    pokemonSpy.getSearchTerm.and.returnValue(of('saur'));
    pokemonSpy.isFiltered.and.returnValue(of(true));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getPokemon', () => {
    it('should call the getPokemon method', () => {
      component.getPokemon();

      expect(pokemonSpy.getPokemon).toHaveBeenCalled();
    })

    it('should load the pokemon into the thumbnail', () => {
      const pokemonList = fixture.debugElement.queryAll(By.directive(ThumbnailStubComponent));
      const pokemon = {id: 1, name: "Venusaur", count: 400, userId: 1};

      expect(pokemonList.length).toBe(2);
      expect(pokemonList[0].componentInstance.pokemon).toEqual(pokemon);
    })
  })

  describe('routing', () => {
    it('should reroute to the error page if not logged in', () => {
      loggedIn.next(false);
      const navigateSpy = spyOn(router, 'navigate');
      component.ngOnInit();

      expect(navigateSpy).toHaveBeenCalledWith(['/notlogin']);

      loggedIn.next(true);
    })

    it('should redirect to the selected pokemon detail page', () => {
      const navigateSpy = spyOn(router, 'navigateByUrl');
      const pokemonList = fixture.debugElement.queryAll(By.css('.col-md-4'));

      pokemonList[0].nativeElement.dispatchEvent(new Event('click'));

      expect(navigateSpy).toHaveBeenCalledWith(router.createUrlTree(['/detail/1']), jasmine.anything());
    })
  })

  describe('filtering', () => {
    it('should get the current search term and filtered from pokemonService', () => {
      expect(pokemonSpy.isFiltered).toHaveBeenCalled();
      expect(pokemonSpy.getSearchTerm).toHaveBeenCalled();

      component.filterTerm$.pipe(
        take(1),
        map((data: string) => expect(data).toBe('saur'))
      ).subscribe();

      component.isFiltered$.pipe(
        take(1),
        map((data: boolean) => expect(data).toBe(true))
      ).subscribe();
    })

    it('should show the clear button and search term when filtered', () => {
      component.isFiltered$ = of(true);
      fixture.detectChanges();

      let clearButton = fixture.debugElement.nativeElement.querySelector('.clear');
      let searchTerm = fixture.debugElement.nativeElement.querySelector('p');

      expect(clearButton).toBeTruthy();
      expect(searchTerm).toBeTruthy();
      expect(fixture.debugElement.query(By.css('#new'))).toBeNull();

      expect(searchTerm.textContent).toContain("saur");
      clearButton.click();
      expect(pokemonSpy.changeTerm).toHaveBeenCalledWith("");
    })

    it('should show the new pokemon button when not filtered', () => {
      const navigateSpy = spyOn(router, 'navigateByUrl');
      component.isFiltered$ = of(false);
      fixture.detectChanges();

      let newButton = fixture.debugElement.nativeElement.querySelector('#new');

      expect(newButton).toBeTruthy();
      expect(fixture.debugElement.query(By.css('p'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.clear'))).toBeNull();

      newButton.click();
      expect(navigateSpy).toHaveBeenCalledWith(router.createUrlTree(['/new']), jasmine.anything());
    })
  })
});


@Component({selector: 'app-pokemon-thumbnail', template: ''})
class ThumbnailStubComponent {
  @Input()
  public pokemon!: Pokemon;
}