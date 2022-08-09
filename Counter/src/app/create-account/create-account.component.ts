import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { UserService } from '../shared/user-service';
import { map, take } from 'rxjs';
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

  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(formValues: User) {
    this.userService.createAccount(formValues).pipe(
      take(1),
      map((user: User) => {
        this.userService.logIn(user.id);
      })
    ).subscribe(_ => this.router.navigate(['/home']));
  }

}
