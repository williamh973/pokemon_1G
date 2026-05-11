export class Team {
  constructor() {
    this.pokemons = [];
  }

  add(pokemon) {
    this.pokemons.push(pokemon);
    console.log(this.pokemons);
  }
}
