export class Team {
  constructor(player) {
    this.player = player;
    this.pokemons = [];
  }

  add() {
    console.log(this.player.starter);
  }
}
