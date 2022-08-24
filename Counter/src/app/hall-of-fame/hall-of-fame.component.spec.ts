import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HallOfFameService } from '../shared/hall-of-fame-service';
import { Pokemon } from '../shared/pokemon';
import { UserService } from '../shared/user-service';

import { HallOfFameComponent } from './hall-of-fame.component';

describe('HallOfFameComponent', () => {
  let component: HallOfFameComponent;
  let fixture: ComponentFixture<HallOfFameComponent>;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let loggedIn = new BehaviorSubject(true);
  let userServiceStub: Partial<UserService> = {
    getLogIn(): Observable<boolean> {
      return loggedIn.asObservable();
    }
  };
  let hallSpy = jasmine.createSpyObj('HallOfFameService', ['changePhrase', 'getShiny']);
  let lightGray = 'rgb(85, 85, 85)';
  let darkGray = 'rgb(55, 55, 55)';


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HallOfFameComponent, ThumbnailStubComponent ],
      providers: [ { provide: HallOfFameService, useValue: hallSpy },
        { provide: UserService, useValue: userServiceStub },
        { provide: Router, useValue: routerSpy } ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallOfFameComponent);
    component = fixture.componentInstance;
    hallSpy.getShiny.and.returnValue(of([{id: 1, name: "Raticate", count: 3, userId: 1},
    {id: 2, name: "Audino", count: 4914, userId: 1}]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getShiny', () => {
    it('should load the shinies into the thumbnail', () => {
      const shinyList = fixture.debugElement.queryAll(By.directive(ThumbnailStubComponent));
      const pokemon = {id: 1, name: "Raticate", count: 3, userId: 1};

      expect(shinyList.length).toBe(2);
      expect(shinyList[0].componentInstance.pokemon).toEqual(pokemon);
    })
  })

  describe('getShiny', () => {
    it('should properly get the shiny', () => {
      component.getShiny();

      expect(hallSpy.getShiny).toHaveBeenCalled();
    })
  })

  describe('changePhrase', () => {
    it('should properly change for time', () => {
      let orderButton = fixture.debugElement.nativeElement.querySelector('.add');
      hallSpy.changePhrase.calls.reset();

      orderButton.click();

      expect(hallSpy.changePhrase).toHaveBeenCalledWith('time');
    })

    it('should properly change for ascending', () => {
      let ascButton = fixture.debugElement.nativeElement.querySelector('.asc');
      hallSpy.changePhrase.calls.reset();

      ascButton.click();

      expect(hallSpy.changePhrase).toHaveBeenCalledWith('asc');
    })

    it('should properly change for descending', () => {
      let descButton = fixture.debugElement.nativeElement.querySelector('.desc');
      hallSpy.changePhrase.calls.reset();

      descButton.click();

      expect(hallSpy.changePhrase).toHaveBeenCalledWith('desc');
    })
  })

  describe('buttons', () => {
    it('should change the styles for the buttons if time is clicked', () => {
      let orderButton = fixture.debugElement.nativeElement.querySelector('.add');

      orderButton.click();
      fixture.detectChanges();

      expect(orderButton.style.backgroundColor).toBe(lightGray);
      expect(fixture.debugElement.nativeElement.querySelector('.asc').style.backgroundColor).toBe(darkGray);
      expect(fixture.debugElement.nativeElement.querySelector('.desc').style.backgroundColor).toBe(darkGray);
    })

    it('should change the styles for the buttons if asc is clicked', () => {
      let ascButton = fixture.debugElement.nativeElement.querySelector('.asc');

      ascButton.click();
      fixture.detectChanges();

      expect(ascButton.style.backgroundColor).toBe(lightGray);
      expect(fixture.debugElement.nativeElement.querySelector('.add').style.backgroundColor).toBe(darkGray);
      expect(fixture.debugElement.nativeElement.querySelector('.desc').style.backgroundColor).toBe(darkGray);
    })

    it('should change the styles for the buttons if desc is clicked', () => {
      let descButton = fixture.debugElement.nativeElement.querySelector('.desc');

      descButton.click();
      fixture.detectChanges();

      expect(descButton.style.backgroundColor).toBe(lightGray);
      expect(fixture.debugElement.nativeElement.querySelector('.asc').style.backgroundColor).toBe(darkGray);
      expect(fixture.debugElement.nativeElement.querySelector('.add').style.backgroundColor).toBe(darkGray);
    })
  })

  describe('getLogIn', () => {
    it('should redirect to an error page if not logged in', () => {
      loggedIn.next(false);
      component.ngOnInit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/notlogin']);

      loggedIn.next(true);
    })
  })
});

@Component({selector: 'app-pokemon-thumbnail', template: ''})
class ThumbnailStubComponent {
  @Input()
  public pokemon!: Pokemon;
}
