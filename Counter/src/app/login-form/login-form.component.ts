import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { UserService } from '../shared/user-service';
import { take, map } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  email!: string;
  password!: string;
  mouseOver: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(formValues: User) {
    this.userService.logIn(formValues.email, formValues.password).pipe(
      take(1),
      map((matchingUser: User[]) => {
        if (matchingUser) {
          this.userService.setId(matchingUser[0].id);
        }
      })
    ).subscribe();
  }
}
