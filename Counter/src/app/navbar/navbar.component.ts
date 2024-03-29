import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PokemonService } from '../shared/pokemon-service';
import { UserService } from '../shared/user-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchTerm: string = "";
  isLoggedIn: Observable<boolean>;

  constructor(private router: Router,
    private pokemonService: PokemonService,
    private userService: UserService) { 
      this.isLoggedIn = this.userService.getLogIn();
    }

  search() {
    this.router.navigate(["/home"]);
    this.pokemonService.changeTerm(this.searchTerm);
    this.searchTerm = "";
  }

  logOut() {
    this.userService.logOut();
    this.searchTerm = "";
    this.pokemonService.changeTerm("");
    this.router.navigate(['/intro']);
  }

}
