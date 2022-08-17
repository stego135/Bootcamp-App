import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { UserService } from '../shared/user-service';

import { IntroComponent } from './intro.component';

describe('IntroComponent', () => {
  let component: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;
  let userServiceStub: Partial<UserService> = {
    getLogIn(): Observable<boolean> {
      return of(true);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroComponent ],
      providers: [ { provide: UserService, useValue: userServiceStub } ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('bottom buttons', () => {

    it('should display the correct buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.left-button')?.textContent).toContain('ongoing');
      expect(compiled.querySelector('.right-button')?.textContent).toContain('list');
      expect(compiled.querySelector('.left-button')?.textContent).not.toContain('started')
      expect(compiled.querySelector('.right-button')?.textContent).not.toContain('Log in');
    })
  })
});
