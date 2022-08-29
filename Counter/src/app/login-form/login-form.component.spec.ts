import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../shared/user';
import { UserService } from '../shared/user-service';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let userSpy = jasmine.createSpyObj('UserService', ['checkAccount', 'logIn']);
  let routerSpy = {navigate: jasmine.createSpy('navigate')};


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginFormComponent ],
      providers: [ { provide: UserService, useValue: userSpy }, 
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

  describe('submit', () => {
    it('should not log in a user if none match', () => {
      let user = {email: "test@test.com", password: "test"};
      userSpy.checkAccount.and.returnValue(of([]));
      userSpy.checkAccount.calls.reset();
      userSpy.logIn.calls.reset();

      component.onSubmit(<User>user);

      expect(userSpy.checkAccount).toHaveBeenCalled();
      expect(userSpy.logIn).not.toHaveBeenCalled();
    })

    it('should display and error if not successful', () => {
      let user = {email: "test@test.com", password: "test"};
      userSpy.checkAccount.and.returnValue(of([]));

      component.onSubmit(<User>user);
      fixture.detectChanges();

      let alert = fixture.debugElement.query(By.css('.alert-danger'));
      expect(alert).toBeTruthy();
    })

    it('should log in a user if successful', () => {
      let user = {email: "test@test.com", password: "test"};
      userSpy.checkAccount.and.returnValue(of([{id: 1, email: "test@test.com", password: "test"}]));
      userSpy.checkAccount.calls.reset();
      userSpy.logIn.calls.reset();

      component.onSubmit(<User>user);

      expect(userSpy.checkAccount).toHaveBeenCalled();
      expect(userSpy.logIn).toHaveBeenCalledWith(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    })
  })
});
