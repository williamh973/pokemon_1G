export class Warp {
  constructor({ from, toMap, to, facing }) {
    this.from = from;
    this.toMap = toMap;
    this.to = to;
    this.facing = facing;
  }

  matches(x, y) {
    return this.from.x === x && this.from.y === y;
  }
}
