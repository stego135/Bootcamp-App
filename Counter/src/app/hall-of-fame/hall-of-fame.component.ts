import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HallOfFameService } from '../shared/hall-of-fame-service';
import { Pokemon } from '../shared/pokemon';

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

  constructor(private hallOfFameService: HallOfFameService) { }

  ngOnInit(): void {
    this.getShiny();
  }
  
  getShiny() {
    this.shiny = this.hallOfFameService.getShiny();
    this.isTime = true;
    this.isAsc = false;
    this.isDesc = false;
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
