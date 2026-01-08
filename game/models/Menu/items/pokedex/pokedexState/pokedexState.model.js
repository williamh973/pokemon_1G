export class PokedexState {
  constructor() {
    this.seen = new Set(["001", "003"]);
    this.caught = new Set(["001"]);
  }

  isSeen(id) {
    return this.seen.has(id);
  }

  isCaught(id) {
    return this.caught.has(id);
  }
}
