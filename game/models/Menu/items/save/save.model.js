export class Save {
  constructor() {
    this.player = {
      tileX: 0,
      tileY: 0,
    };
  }

  capture(game) {
    this.player.tileX = game.player.tileX;
    this.player.tileY = game.player.tileY;
    this.currentMap = game.currentMap;
  }

  write() {
    localStorage.setItem("POKEMON_SAVE", JSON.stringify(this));
  }

  static load() {
    const raw = localStorage.getItem("POKEMON_SAVE");
    if (!raw) return null;

    const data = JSON.parse(raw);
    return Object.assign(new Save(), data);
  }

  apply(game) {
    game.player.tileX = this.player.tileX;
    game.player.tileY = this.player.tileY;

    game.currentMap = game.mapManager.get(this.world.currentMap);
  }
}

// pour plus tard
//   name: "",
//   facing: "down",
//   team: [],
//   inventory: {},
//   money: 0,
// };
// this.flags = {};
// this.defeatedTrainers = [];
// this.pokedex = {
//   seen: [],
//   caught: [],
// };
// this.team = {};
// this.playTime = [];
// this.time = {
//   hour: 0,
//   minute: 0,
//   totalMinutes: 0,
// };
