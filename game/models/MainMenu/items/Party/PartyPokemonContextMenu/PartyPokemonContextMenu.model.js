export class PokemonContextMenu extends Menu {
  constructor(game, pokemon) {
    super(game);

    this.pokemon = pokemon;

    this.items = [
      { id: "SUMMARY", name: "RESUME" },
      { id: "SWITCH", name: "ECHANGER" },
      { id: "ITEM", name: "OBJET" },
      { id: "CANCEL", name: "RETOUR" },
    ];
  }
}
