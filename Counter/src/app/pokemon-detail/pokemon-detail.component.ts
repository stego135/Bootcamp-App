import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';
import { forkJoin, Observable, map, take, combineLatest } from 'rxjs';
import { HallOfFameService } from '../shared/hall-of-fame-service';
import { UserService } from '../shared/user-service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  id!: number
  pokemon: Pokemon = new Pokemon;
  image$!: Observable<string>;
  redirect: boolean = true;
  isDelete: boolean = false;
  isHall: boolean = false;

  constructor(private route: ActivatedRoute, 
    private pokemonService: PokemonService,
    private hallOfFameService: HallOfFameService,
    private router: Router,
    private userService: UserService ) { }

  ngOnInit(): void {
    this.getId();
    this.getPokemon();
    this.userService.getLogIn().pipe(
      take(1),
      map((isUser: boolean) => {
        if (!isUser) {
          this.router.navigate(['/notlogin'])
        }
      })
    ).subscribe();
    /*
    this.userService.getId().pipe(
      take(1),
      map((userId: number) => {
        console.log('here');
        console.log(this.pokemon.userId + " poke");
        console.log(userId + ' user');
        if(this.pokemon.userId != userId) this.router.navigate(['/error']);
      })
    ).subscribe();*/
  }
  getId(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }
  getPokemon() {
    combineLatest([this.pokemonService.getOnePokemon(this.id), this.userService.getId()]).pipe(
      take(1),
      map(([selectedPoke, userId]) => {
        if (selectedPoke ==  null || selectedPoke.userId != userId) {
          this.router.navigate(["/error"]);
          selectedPoke = {id: -1, name: "error", count: 0, userId: 0};
        } else this.pokemon = selectedPoke;
      })
    ).subscribe(_ => {
      if (this.pokemon.id != -1) this.getImageUrl();
    });
  }
  getImageUrl() {
    this.image$ = this.pokemonService.getImage(this.pokemon);
  }
  add() {
    this.pokemon.count+=1;
    this.pokemonService.updatePokemon(this.pokemon).pipe(
      take(1)
    ).subscribe();
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
  addToHall() {
    this.redirect = false;
    forkJoin([this.hallOfFameService.addPokemon(this.pokemon), this.pokemonService.removePokemon(this.id)]).pipe(
      take(1),
      map(([added, deleted]: [Pokemon, Pokemon]) => {
        if (added && !deleted) this.router.navigate(['/hall']);
      }
      )
    ).subscribe();
  }
  delete() {
    this.pokemonService.removePokemon(this.id).pipe(
      take(1)
    ).subscribe(_ => this.router.navigate(['/home']));
  }
  warning(isDelete: boolean) {
    if (isDelete) this.isDelete = true;
    else this.isHall = true;
    
  }
  clear(isDelete: boolean) {
    if(isDelete) this.isDelete = false;
    else this.isHall = false;
  }
}
