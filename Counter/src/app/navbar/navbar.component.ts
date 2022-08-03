import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from '../shared/pokemon-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchTerm: string = "";

  constructor(private router: Router,
    private pokemonService: PokemonService) { }

  ngOnInit(): void {
  }

  search() {
    this.router.navigate(["/home"]);
    this.pokemonService.changeTerm(this.searchTerm);
    this.searchTerm = "";
  }

}
