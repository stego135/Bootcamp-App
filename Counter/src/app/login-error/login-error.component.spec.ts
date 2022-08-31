import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginErrorComponent } from './login-error.component';

describe('LoginErrorComponent', () => {
  let component: LoginErrorComponent;
  let fixture: ComponentFixture<LoginErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('redirection', () => {
    it('should redirect to the login page', () => {
      let loginButton = fixture.debugElement.nativeElement.querySelector('.redirect');

      expect(loginButton.getAttribute('routerLink')).toEqual('/login');
    })
  })
});
