import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../shared/user-service';

import { IntroComponent } from './intro.component';

describe('IntroComponent', () => {
  let component: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;
  let userSpy = jasmine.createSpyObj('UserService', ['getLogIn']);
  let isLoggedInStream = new BehaviorSubject(true);
  userSpy.getLogIn.and.returnValue(isLoggedInStream.asObservable());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroComponent ],
      providers: [ { provide: UserService, useValue: userSpy } ]
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

    it('should display the correct buttons when logged in', () => {
      isLoggedInStream.next(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.left-button')?.textContent).toContain('ongoing');
      expect(compiled.querySelector('.right-button')?.textContent).toContain('list');
      expect(compiled.querySelector('.left-button')?.textContent).not.toContain('started')
      expect(compiled.querySelector('.right-button')?.textContent).not.toContain('Log in');
    })

    it('should display the correct buttons when logged out', () => {
      isLoggedInStream.next(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.left-button')?.textContent).toContain('started');
      expect(compiled.querySelector('.right-button')?.textContent).toContain('Log in');
      expect(compiled.querySelector('.left-button')?.textContent).not.toContain('ongoing')
      expect(compiled.querySelector('.right-button')?.textContent).not.toContain('list');
    })
  })
});
