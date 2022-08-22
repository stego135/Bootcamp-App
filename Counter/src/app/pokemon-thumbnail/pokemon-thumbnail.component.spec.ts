import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../shared/pokemon-service';

import { PokemonThumbnailComponent } from './pokemon-thumbnail.component';

describe('PokemonThumbnailComponent', () => {
  let component: PokemonThumbnailComponent;
  let fixture: ComponentFixture<PokemonThumbnailComponent>;
  let pokemonServiceStub: Partial<PokemonService> = {
    getImage(): Observable<string> {
      return of("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/150.png");
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
    component.pokemon = {id: 6, name: "Mewtwo", count: 50, userId: 1};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Correct display', () => {
    it('should display the correct Pokemon name and count', () => {
      let pokeName = fixture.debugElement.nativeElement.querySelector('.pokemon-name');

      expect(pokeName.textContent).toEqual("Mewtwo");
    }),

    it('should display the correct image', () => {
      let pokeCount = fixture.debugElement.nativeElement.querySelector('.pokemon-count');

      expect(pokeCount.textContent).toEqual("Count: 50");
    }),

    it('should display the correct image', () => {
      let pokeImg = fixture.debugElement.nativeElement.querySelector('.poke-icon');

      expect(pokeImg.src).toEqual("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/150.png");
    })
  })
});
