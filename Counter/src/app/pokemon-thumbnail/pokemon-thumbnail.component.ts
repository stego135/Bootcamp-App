import { Component, OnInit, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-pokemon-thumbnail',
  templateUrl: './pokemon-thumbnail.component.html',
  styleUrls: ['./pokemon-thumbnail.component.css']
})
export class PokemonThumbnailComponent implements OnInit {

  @Input() pokemon:any
  data:any

  constructor(private http:HttpClient) {
  }

  ngOnInit(): void {
    this.getImageUrl();
  }

  getImageUrl() {
    var lowerName = new String(this.pokemon.name);
    lowerName  = lowerName[0].toLowerCase() + lowerName.slice(1);
    this.http.get("https://pokeapi.co/api/v2/pokemon/" + lowerName).subscribe(data=> {
      this.data = data;
    });
  }

}
