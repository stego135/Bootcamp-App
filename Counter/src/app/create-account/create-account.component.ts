import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { UserService } from '../shared/user-service';
import { map, mergeMap, of, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  email!: string;
  password!: string;
  mouseOver: boolean = false;
  dupError: boolean = false;

  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(formValues: User) {
    this.dupError = false;
    this.userService.checkEmail(formValues.email).pipe(
      take(1),
      map((matchingUser: User[]) => {
        if (matchingUser.length == 0) {
          return true;
        } else {
          return false;
        }
      }),
      mergeMap((isNotDup: boolean) => {
        if (isNotDup) return this.userService.createAccount(formValues);
        else return of(formValues);
      }),
      map((user: User) => {
        if (user.id) this.userService.logIn(user.id);
        return user;
      })
    ).subscribe((user: User) => {
      if (user.id) this.router.navigate(['/home'])
      else this.dupError = true;
    });
  }

}
