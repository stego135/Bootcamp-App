import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  name!: String

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getName();
  }
  getName(): void {
    this.name = String(this.route.snapshot.paramMap.get('name'));
  }

}
