import { Component } from '@angular/core';
import { User } from '../shared/user';
import { UserService } from '../shared/user-service';
import { take, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  email!: string;
  password!: string;
  mouseOver: boolean = false;
  accountError: boolean = false;

  constructor(private userService: UserService, 
    private router: Router) { }

  onSubmit(formValues: User) {
    this.accountError = false;
    this.userService.checkAccount(formValues.email, formValues.password).pipe(
      take(1),
      map((matchingUser: User[]) => {
        if (matchingUser.length != 0) {
          this.userService.logIn(matchingUser[0].id);
          this.router.navigate(['/home']);
        } else {
          this.accountError = true;
        }
      })
    ).subscribe();
  }
}
