export class Team {
  constructor(player) {
    this.player = player;
    this.pokemons = [];
  }

  add(pokemon) {
    this.pokemons.push(pokemon);
    console.log(this.pokemons);
  }
}
