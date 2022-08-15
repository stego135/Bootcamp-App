import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../shared/user';
import { UserService } from '../shared/user-service';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let userServiceStub: Partial<UserService> = {
    checkAccount(email: string, password: string): Observable<User[]> {
      return of([{id: 1, email: "test@test.com", password: "test"}]);
    }
  };
  let routerSpy = {navigate: jasmine.createSpy('navigate')};


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginFormComponent ],
      providers: [ { provide: UserService, useValue: userServiceStub }, 
        { provide: Router, useValue: routerSpy } ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
