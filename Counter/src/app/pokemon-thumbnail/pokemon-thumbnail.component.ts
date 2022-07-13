import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pokemon-thumbnail',
  templateUrl: './pokemon-thumbnail.component.html',
  styleUrls: ['./pokemon-thumbnail.component.css']
})
export class PokemonThumbnailComponent implements OnInit {

  @Input() pokemon:any

  constructor() { }

  ngOnInit(): void {
  }

}
