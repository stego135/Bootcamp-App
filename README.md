# Pokémon Shiny Counter

## Description

This app will allow a user to keep track of any current shiny Pokémon hunts that they have going on. It will contain a list of all current hunts for the current user. Clicking on one will take the user to a page with more detail about the Pokémon selected and the ability to increase the current encounters for that Pokémon.

## Pages

* Home Page
    * Log in through here
* List of Pokémon
    * Each Pokémon in the list will have a tiny image to easily distinguish them from the others
    * Potentially use Bootstrap to make item row length dependant on screen size
* Pokémon Specific Page
    * Will use [PokéAPI](https://pokeapi.co/) to generate image of the shiny Pokémon
    * Includes button to increase counter
    * Shows the current percentage chance of getting a shiny within the current count (1-(1-(percent chance of shiny))^currrent encounters)
        * (Optional) Some shiny hunting methods like SOS chaining have a dynamic encounter rate depending on the length of the hunt
    * Shows the shiny hunting method
* Create New Pokémon
    * A form page that will generate a new instance of a Pokémon
    * Should contain a space for the name of the Pokémon, the current shiny hunting method, and the shiny odds of that method
    * (Optional) Check to see if Pokémon exists through error message with PokéAPI
    * (Optional) Store shiny hunting odds on the app like [this website](https://jmeech.github.io/) or [this website](https://shinytrack.night.coffee/#/shiny/track)
* Create New Account