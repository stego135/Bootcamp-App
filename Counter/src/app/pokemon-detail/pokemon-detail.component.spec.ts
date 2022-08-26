import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { map, Observable, of, take } from 'rxjs';
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
  let userSpy = jasmine.createSpyObj('UserService', ['getLogIn', 'getId']);
  let pokemonSpy = jasmine.createSpyObj('PokemonService', ['getOnePokemon', 'getImage', 'updatePokemon', 'removePokemon']);
  let hallSpy = jasmine.createSpyObj('HallOfFameService', ['addPokemon']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ PokemonDetailComponent ],
      providers: [ { provide: PokemonService, useValue: pokemonSpy },
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: HallOfFameService, useValue: hallSpy } ]
    })
    .compileComponents();

    pokemonSpy.getOnePokemon.and.returnValue(of({id: 1, name: "Venusaur", count: 400, userId: 1}));
    pokemonSpy.getImage.and.returnValue(of("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/3.png"));
    pokemonSpy.updatePokemon.and.returnValue(of({id: 1, name: "Venusaur", count: 401, userId: 1}));
    userSpy.getLogIn.and.returnValue(of(true));
    userSpy.getId.and.returnValue(of(1));
    hallSpy.addPokemon.and.returnValue(of({id: 1, name: "Venusaur", count: 400, userId: 1}))

    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should correctly load the id from the url', () => {
      const componentSpy = spyOn(component, 'getId')
      component.ngOnInit();

      expect(componentSpy).toHaveBeenCalled();
      expect(component.id).toBe(1);
    })

    it('should get the correct pokemon from pokemonService', () => {
      component.ngOnInit();

      expect(pokemonSpy.getOnePokemon).toHaveBeenCalledWith(1);
      expect(component.pokemon).toEqual({id: 1, name: "Venusaur", count: 400, userId: 1});
    })

    it('should get the correct image from pokemonService', () => {
      component.ngOnInit();

      expect(pokemonSpy.getImage).toHaveBeenCalledWith({id: 1, name: "Venusaur", count: 400, userId: 1});
      component.image$.pipe(
        take(1),
        map((image: string) => expect(image).toEqual("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/3.png"))
      ).subscribe();
    })

    it('should not load an image if a pokemon does not exist', () => {
      pokemonSpy.getOnePokemon.and.returnValue(of(null));
      component.ngOnInit();
      fixture.detectChanges();

      pokemonSpy.getImage.calls.reset();
      expect(pokemonSpy.getImage).not.toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/error']);
    })
/*
    it('should redirect if the userId does not match the pokemon userId', () => {
      userSpy.getId.and.returnValue(of(2));
      component.ngOnInit();
      fixture.detectChanges();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/error']);
    })*/

    it('should redirect if the user is not logged in', () => {
      userSpy.getLogIn.and.returnValue(of(false))
      component.ngOnInit();
      fixture.detectChanges();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/notlogin']);
    })

    it('should load the pokemon name, count, and image into the page', () => {
      let intro = fixture.debugElement.nativeElement.querySelector('p');
      let header = fixture.debugElement.nativeElement.querySelector('h2');
      let countBox = fixture.debugElement.nativeElement.querySelector('#count-form');
      let image = fixture.debugElement.nativeElement.querySelector('img');

      expect(intro.textContent).toContain("Venusaur");
      expect(intro.textContent).toContain("400");
      expect(header.textContent).toContain("Venusaur");
      expect(countBox.value).toContain(400);
      expect(image.src).toContain("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/3.png");
    })
  })

  describe("updatePokemon", () => {
    it('should send an update to the pokemonService', () => {
      let addButton = fixture.debugElement.nativeElement.querySelector('.counter-add');

      addButton.click();

      expect(pokemonSpy.updatePokemon).toHaveBeenCalledWith({id: 1, name: "Venusaur", count: 401, userId: 1})
    })

    it('should update the count on the page', fakeAsync(() => {
      let addButton = fixture.debugElement.nativeElement.querySelector('.counter-add');
      let intro = fixture.debugElement.nativeElement.querySelector('p');
      let countBox = fixture.debugElement.nativeElement.querySelector('#count-form');

      addButton.click();
      fixture.detectChanges();
      tick();

      expect(intro.textContent).toContain("401");
      expect(countBox.value).toContain(401);
    }))
  })

  describe('goBack', () => {
    it('should redirect to the home page when clicked', () => {
      let backButton = fixture.debugElement.nativeElement.querySelector('.go-back');

      backButton.click();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    })
  })

  describe('alerts', () => {
    it('should not appear if not clicked', () => {
      let hallAlert = fixture.debugElement.query(By.css('.alert-primary'));
      let deleteAlert = fixture.debugElement.query(By.css('.alert-danger'));

      expect(hallAlert).toBeFalsy();
      expect(deleteAlert).toBeFalsy();
    })

    it('should show the hall of fame alert when the correct button is clicked', () => {
      let hallButton = fixture.debugElement.nativeElement.querySelector('.hall-of-fame-add');

      hallButton.click();
      fixture.detectChanges();

      let hallAlert = fixture.debugElement.query(By.css('.alert-primary'));
      expect(hallAlert.nativeElement).toBeTruthy();
    })

    it('should show the delete alert when the correct button is clicked', () => {
      let deleteButton = fixture.debugElement.nativeElement.querySelector('.delete');

      deleteButton.click();
      fixture.detectChanges();

      let deleteAlert = fixture.debugElement.query(By.css('.alert-danger'));
      expect(deleteAlert).toBeTruthy();
    })

    it('should remove the hall alert when the cancel button is clicked', () => {
      let hallButton = fixture.debugElement.nativeElement.querySelector('.hall-of-fame-add');
      hallButton.click();
      fixture.detectChanges();

      let hallAlert = fixture.debugElement.query(By.css('.alert-primary'));
      expect(hallAlert.nativeElement).toBeTruthy();
      
      let noAlert = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
      noAlert.click();
      fixture.detectChanges();

      hallAlert = fixture.debugElement.query(By.css('.alert-primary'));
      expect(hallAlert).toBeFalsy();
    })

    it('should remove the delete alert when the cancel button is clicked', () => {
      let deleteButton = fixture.debugElement.nativeElement.querySelector('.delete');
      deleteButton.click();
      fixture.detectChanges();

      let deleteAlert = fixture.debugElement.query(By.css('.alert-danger'));
      expect(deleteAlert.nativeElement).toBeTruthy();
      
      let noAlert = fixture.debugElement.query(By.css('.btn-danger')).nativeElement;
      noAlert.click();
      fixture.detectChanges();

      deleteAlert = fixture.debugElement.query(By.css('.alert-primary'));
      expect(deleteAlert).toBeFalsy();
    })
  })

  describe('delete', () => {
    pokemonSpy.removePokemon.and.returnValue(of(null));
    it('should redirect to the home page when clicked', () => {
      let deleteButton = fixture.debugElement.nativeElement.querySelector('.delete');
      deleteButton.click();
      fixture.detectChanges();
      
      let deletePokemon = fixture.debugElement.query(By.css('.alert-danger .btn-dark')).nativeElement;
      deletePokemon.click();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    })

    it('should call the deletePokemon method from pokemonService', () => {
      let deleteButton = fixture.debugElement.nativeElement.querySelector('.delete');
      deleteButton.click();
      fixture.detectChanges();
      
      let deletePokemon = fixture.debugElement.query(By.css('.alert-danger .btn-dark')).nativeElement;
      deletePokemon.click();

      expect(pokemonSpy.removePokemon).toHaveBeenCalledWith(1);
    })
  })

  describe('addToHall', () => {
    pokemonSpy.removePokemon.and.returnValue(of(null));
    it('should delete the pokemon', () => {
      let addToHall = fixture.debugElement.nativeElement.querySelector('.hall-of-fame-add');
      addToHall.click();
      fixture.detectChanges();
      
      let addButton = fixture.debugElement.query(By.css('.alert-primary .btn-dark')).nativeElement;
      addButton.click();

      expect(pokemonSpy.removePokemon).toHaveBeenCalledWith(1);
    })

    it('should add the pokemon to the hall of fame service', () => {
      let addToHall = fixture.debugElement.nativeElement.querySelector('.hall-of-fame-add');
      addToHall.click();
      fixture.detectChanges();
      
      let addButton = fixture.debugElement.query(By.css('.alert-primary .btn-dark')).nativeElement;
      addButton.click();

      expect(hallSpy.addPokemon).toHaveBeenCalledWith({id: 1, name: "Venusaur", count: 400, userId: 1});
    })

    it('should redirect to the hall page if both methods complete', () => {
      let addToHall = fixture.debugElement.nativeElement.querySelector('.hall-of-fame-add');
      addToHall.click();
      fixture.detectChanges();
      
      let addButton = fixture.debugElement.query(By.css('.alert-primary .btn-dark')).nativeElement;
      addButton.click();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hall']);
    })
  })
});
