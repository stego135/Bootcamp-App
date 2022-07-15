import { Component, OnInit } from '@angular/core';
import { HallOfFameService } from '../shared/hall-of-fame-service';
import { Pokemon } from '../shared/pokemon';

@Component({
  selector: 'app-hall-of-fame',
  templateUrl: './hall-of-fame.component.html',
  styleUrls: ['./hall-of-fame.component.css']
})
export class HallOfFameComponent implements OnInit {
  shiny!: Pokemon[]

  constructor(private hallOfFameService: HallOfFameService) { }

  ngOnInit(): void {
    this.getShiny();
    this.shiny = this.hallOfFameService.sortAsc();
  }
  
  getShiny() {
    this.shiny = this.hallOfFameService.getShiny();
  }

}