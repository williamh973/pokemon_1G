export const TILES_SIZE = 32;
export const font = "PixelOperator";
export const FADING_TIME = 10;

export const dialogBoxParams = {
  isOpen: false,
  height: 65,
};

export const PLAYER_STATE = {
  IDLE: "idle",
  WALK: "walk",
  RUN: "run",
  SURF: "surf",
  FISH: "fish",
  FLY: "fly",
  TELEPORT: "teleport",
};

export const PLAYER_ABILITIES = {
  surf: false,
  fish: false,
  cut: false,
  smash: false,
  fly: false,
  teleport: false,
};

export const createImg = (path) => {
  const image = new Image();
  image.src = path;
  return image;
};

export const createSong = (path) => {
  const audio = new Audio();
  audio.src = path;
  return audio;
};

export const drawDebugCollisionSquare = (element, context, enabled) => {
  if (!enabled) return;

  if (element && context) {
    context.beginPath();
    context.strokeStyle = "red";
    context.lineWidth = 1;

    context.rect(
      element.position.x,
      element.position.y,
      element.width,
      element.height
    );

    context.stroke();
  }
};
export const drawBox = (
  context,
  positionX,
  positionY,
  width,
  height,
  color,
  fillStyle
) => {
  const borderColor = color;
  context.fillStyle = fillStyle;

  context.fillRect(positionX, positionY, width, height);

  context.strokeStyle = borderColor;
  context.lineWidth = 2;
  context.strokeRect(positionX, positionY, width, height);
};

export const GAME_FLAGS = {
  GOT_POTION_REDHOUSE_2F: false,
  OAK_INTRO_DONE: false,
  GOT_STARTER: false,
  TALKED_TO_MOM: false,
  PLAYER_NAMED: false,
  RIVAL_NAMED: false,
  RIVAL_GOT_STARTER: false,
  FIRST_BATTLE_DONE: false,
  MOM_GAVE_POTION: false,
  TRIED_LEAVING_TOWN: false,
  OAK_STOPPED_PLAYER: false,
  OAK_INTRO_LAB: false,
  ENTERED_OAK_LAB: false,
  POKEDEX_RECEIVED: false,
  OAK_PARCEL_DELIVERED: false,
  OAK_PARCEL_RECEIVED: false,
  GOT_TOWN_MAP: false,
  GOT_POKEDEX: false,
  GOT_POKE_FLUTE: false,
  GOT_SILPH_SCOPE: false,
  GOT_CARD_KEY: false,
  GOT_MASTER_BALL: false,
  BEAT_MISTY: false,
  ROCKET_STOLE_TM28: false,
  SS_ANNE_LEFT: false,
  CUT_RECEIVED: false,
  BEAT_LT_SURGE: false,
  POKEMON_TOWER_CLEARED: false,
  GHOST_REVEALED: false,
  SILPH_CO_CLEARED: false,
  GOT_SILPH_SCOPE: false,
  BEAT_GIOVANNI_SILPH: false,
  ROCKET_HIDEOUT_CLEARED: false,
  ROCKET_ELEVATOR_KEY: false,
  ROCKET_BOSS_DEFEATED: false,
  BADGE_BOULDER: false,
  BADGE_CASCADE: false,
  BADGE_THUNDER: false,
  BADGE_RAINBOW: false,
  BADGE_SOUL: false,
  BADGE_MARSH: false,
  BADGE_VOLCANO: false,
  BADGE_EARTH: false,
  VICTORY_ROAD_OPEN: false,
  ELITE_FOUR_UNLOCKED: false,
  BEAT_LORELEI: false,
  BEAT_BRUNO: false,
  BEAT_AGATHA: false,
  BEAT_LANCE: false,
  BEAT_CHAMPION: false,
  HALL_OF_FAME_REACHED: false,
  ARTICUNO_DEFEATED: false,
  ZAPDOS_DEFEATED: false,
  MOLTRES_DEFEATED: false,
  MEWTWO_DEFEATED: false,
  MEW_OBTAINED: false,
};
