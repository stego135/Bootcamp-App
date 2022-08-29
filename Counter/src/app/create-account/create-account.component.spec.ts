import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../shared/user';
import { UserService } from '../shared/user-service';

import { CreateAccountComponent } from './create-account.component';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let userSpy = jasmine.createSpyObj('UserService', ['checkEmail', 'createAccount', 'logIn']);
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountComponent ],
      providers: [ { provide: UserService, useValue: userSpy }, 
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

  describe('required', () => {
    it('should disable the button on creation', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      let submitButton = fixture.debugElement.query(By.css('#submit'));

      expect(submitButton.nativeElement.disabled).toBeTrue();
    }))
  })

  describe('submit', () => {
    it('should not add a duplicate user', () => {
      let newUser = {email: "test@test.com", password: "test"};
      userSpy.checkEmail.and.returnValue(of([{id: 1, email: "test@test.com", password: "test"}]));
      userSpy.createAccount.and.returnValue(of([{id: 1, email: "test@test.com", password: "test"}]));
      userSpy.createAccount.calls.reset();

      component.onSubmit(<User>newUser);

      expect(userSpy.checkEmail).toHaveBeenCalled();
      expect(userSpy.createAccount).not.toHaveBeenCalled();
    })

    it('should show an error if there is a duplicate user', () => {
      let newUser = {email: "test@test.com", password: "test"};
      userSpy.checkEmail.and.returnValue(of([{id: 1, email: "test@test.com", password: "test"}]));
      userSpy.createAccount.and.returnValue(of([{id: 1, email: "test@test.com", password: "test"}]));

      component.onSubmit(<User>newUser);
      fixture.detectChanges();

      let alert = fixture.debugElement.query(By.css('.alert-danger'));
      let logInButton = fixture.debugElement.query(By.css('.redirect'));
      expect(alert.nativeElement).toBeTruthy();
      expect(logInButton.nativeElement).toBeTruthy();
    })

    it('should create an account if there is no duplicate', () => {
      let newUser = {email: "testing@test.com", password: "test"};
      userSpy.checkEmail.and.returnValue(of([]));
      userSpy.createAccount.and.returnValue(of([{id: 2, email: "testing@test.com", password: "test"}]));
      userSpy.createAccount.calls.reset();

      component.onSubmit(<User>newUser);

      expect(userSpy.checkEmail).toHaveBeenCalledWith("testing@test.com");
      expect(userSpy.createAccount).toHaveBeenCalledWith({email: "testing@test.com", password: "test"});
    })
/*
    it('should log in a user once successfully created', fakeAsync(() => {
      let newUser = {email: "testing@test.com", password: "test"};
      userSpy.checkEmail.and.returnValue(of([]));
      userSpy.createAccount.and.returnValue(of([{id: 2, email: "testing@test.com", password: "test"}]));

      component.onSubmit(<User>newUser);
      tick();

      expect(userSpy.createAccount).toHaveBeenCalledWith({email: "testing@test.com", password: "test"});
      expect(userSpy.logIn).toHaveBeenCalledWith(2);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    }))*/
  })
});
