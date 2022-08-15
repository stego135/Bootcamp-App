import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { PokemonService } from '../shared/pokemon-service';

import { PokemonThumbnailComponent } from './pokemon-thumbnail.component';

describe('PokemonThumbnailComponent', () => {
  let component: PokemonThumbnailComponent;
  let fixture: ComponentFixture<PokemonThumbnailComponent>;
  let pokemonServiceStub: Partial<PokemonService> = {
    getImage(): Observable<string> {
      return of("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/25.png");
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonThumbnailComponent ],
      providers: [ { provide: PokemonService, useValue: pokemonServiceStub } ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
