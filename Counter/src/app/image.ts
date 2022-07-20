export interface ImageData {
    sprites: Sprites;
}

export interface Sprites {
    other: Other;
}

export interface Other {
    home: Home;
}

export interface Home {
    front_shiny: string;
}