import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HallOfFameService } from '../shared/hall-of-fame-service';
import { Pokemon } from '../shared/pokemon';
import { UserService } from '../shared/user-service';

import { HallOfFameComponent } from './hall-of-fame.component';

describe('HallOfFameComponent', () => {
  let component: HallOfFameComponent;
  let fixture: ComponentFixture<HallOfFameComponent>;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let userServiceStub: Partial<UserService> = {
    getLogIn(): Observable<boolean> {
      return of(true);
    }
  };
  let hallServiceStub: Partial<HallOfFameService> = {
    changePhrase(term: string) {},
    getShiny(): Observable<Pokemon[]> {
      return of([{id: 1, name: "Raticate", count: 3, userId: 1},
      {id: 2, name: "Audino", count: 4914, userId: 1}]);
    },
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HallOfFameComponent ],
      providers: [ { provide: HallOfFameService, useValue: hallServiceStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: Router, useValue: routerSpy } ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallOfFameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
