import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take, map } from 'rxjs';
import { HallOfFameService } from '../shared/hall-of-fame-service';
import { Pokemon } from '../shared/pokemon';
import { UserService } from '../shared/user-service';

@Component({
  selector: 'app-hall-of-fame',
  templateUrl: './hall-of-fame.component.html',
  styleUrls: ['./hall-of-fame.component.css']
})
export class HallOfFameComponent implements OnInit {
  shiny!: Observable<Pokemon[]>;
  isTime: Boolean = true;
  isAsc: Boolean = false;
  isDesc: Boolean = false;

  constructor(private hallOfFameService: HallOfFameService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.userService.getLogIn().pipe(
      take(1),
      map((isUser: boolean) => {
        if (!isUser) {
          this.router.navigate(['/notlogin'])
        }
      })
    ).subscribe();
    this.getShiny();
  }
  
  getShiny() {
    this.shiny = this.hallOfFameService.getShiny();
    this.isTime = true;
    this.isAsc = false;
    this.isDesc = false;
    this.sortOrder();
  }
  sortOrder() {
    this.hallOfFameService.changePhrase("time");
    this.isTime = true;
    this.isAsc = false;
    this.isDesc = false;
  }
  sortAsc() {
    this.hallOfFameService.changePhrase("asc");
    this.isTime = false;
    this.isAsc = true;
    this.isDesc = false;
  }
  sortDesc() {
    this.hallOfFameService.changePhrase("desc");
    this.isTime = false;
    this.isAsc = false;
    this.isDesc = true;
  }

}
