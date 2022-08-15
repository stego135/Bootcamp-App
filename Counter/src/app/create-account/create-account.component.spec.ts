import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../shared/user';
import { UserService } from '../shared/user-service';

import { CreateAccountComponent } from './create-account.component';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let userServiceStub: Partial<UserService> = {
    checkEmail(email: string): Observable<User[]> {
      return of([]);
    },
    createAccount(user: User): Observable<User> {
      return of({id: 2, email: "testing@test.com", password: "a"})
    }
  };
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountComponent ],
      providers: [ { provide: UserService, useValue: userServiceStub }, 
        { provide: Router, useValue: routerSpy } ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
