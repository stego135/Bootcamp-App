import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../shared/user-service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent {
  isLoggedIn: Observable<boolean>;

  constructor(private userService: UserService) { 
    this.isLoggedIn = this.userService.getLogIn();
  }

}
