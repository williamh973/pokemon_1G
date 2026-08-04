import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { WORLDMAP_CONFIG } from "../../../../../../render/config/worldMap/worldMap.config.js";
import { idlePlayerDown } from "../../../../../../assets/images/player/player.assets.js";
import { bikeIdlePlayerDown } from "../../../../../../assets/images/player/player.assets.js";
import { WORLDMAP_STATES } from "../../../../../../logic/gameplay/worldMap/worldMap.states.js";
import { textParams } from "../../../../../../shareds/utils/font/font.utils.js";
import { Cursor } from "../../../../../Cursor/Cursor.model.js";
import { INPUT_STATE } from "../../../../../../logic/input/inputs.state.js";
import { loadTiles } from "../../../../../../logic/gameplay/worldMap/worldMapLoadTiles.gameplay.js";
import { drawBackgImage } from "../../../../../../logic/gameplay/worldMap/worldMapBackgImage.gameplay.js";
import { drawWorldMap } from "../../../../../../logic/gameplay/worldMap/drawWorldMap.gameplay.js";
import { drawWeatherState } from "../../../../../../logic/gameplay/worldMap/drawWeatherState.gameplay.js";
import { showPlayer } from "../../../../../../logic/gameplay/worldMap/showPlayer.gameplay..js";
import { openWorldMap } from "../../../../../../logic/gameplay/worldMap/openWorldMap.gameplay.js";
import { drawOverlays } from "../../../../../../logic/gameplay/worldMap/drawOverlays.gameplay.js";
import { MAPS_DATABASE } from "../../../../../../shareds/map/maps.database.js";
import { GAME_STATES } from "../../../../../../logic/gameplay/game/states/states.gameplay.js";

export class WorldMap {
  constructor(game) {
    this.game = game;
    this.possiblePlayerImages = {
      idleDown: idlePlayerDown,
      bikeIdleDown: bikeIdlePlayerDown,
    };
    this.position = {
      x: 0,
      y: 0,
    };
    this.scale = WORLDMAP_CONFIG.scale;
    this.state = null;
    this.selectedPokemon = null;
    this.usedItem = null;
    this.hasFocus = false;
    this.isPlayerVisible = true;
    this.isOpen = false;
    this.images = {};
    this.blinkTimer = 0;
    this.blinkOpacity = 0;

    const MAP = this.game.mapManager.currentMap;
    this.playerCurrentPosition = {
      x: MAP.worldMap.playerPosition.x * WORLDMAP_CONFIG.tileSize,
      y: MAP.worldMap.playerPosition.y * WORLDMAP_CONFIG.tileSize,
    };

    this.cursor = new Cursor("WORLDMAP");
    this.cursor.position.x = this.playerCurrentPosition.x;
    this.cursor.position.y = this.playerCurrentPosition.y;

    this.loadTiles();
  }

  loadTiles() {
    loadTiles(this);
  }

  drawBackgImage(context) {
    drawBackgImage(context, this);
  }

  drawWorldMap(context) {
    drawWorldMap(context, this);
  }

  drawDayTime(context) {
    this.game.timeManager.draw(context);
  }

  draw(context) {
    if (!this.isOpen) return;

    this.drawBackgImage(context);

    this.drawWorldMap(context);

    this.drawWeatherState(context);
    this.drawDayTime(context);
  }

  drawWeatherState(context) {
    drawWeatherState(context, this);
  }

  drawInfos(context, weight, color) {
    const map = this.game.mapManager.currentMap;

    const text = this.selectedPokemon
      ? `Repère de ${this.selectedPokemon.name}`
      : `Vous êtes à ${map.name}`;

    textParams(context, weight, color);
    drawText(context, text, 16, 4);
  }

  showSelectedPokemonAreas(context) {
    this.drawInfos(context, "21", "rgb(255, 255, 255, 0.9)");

    for (const area of this.selectedPokemon.worldMap)
      this.drawOverlays(context, area.pokemonNest);
  }

  showPlayer(context) {
    showPlayer(context, this.playerCurrentPosition, this);
  }

  drawOverlays(context, area) {
    drawOverlays(context, area, this);
  }

  open(selectedPokemonFromPokedex = null, item = null) {
    openWorldMap(selectedPokemonFromPokedex, item, this);
  }

  close() {
    this.isOpen = false;
    this.hasFocus = false;

    switch (this.state) {
      case WORLDMAP_STATES.ENCOUNTER:
        this.game.screenManager.open(
          this.game.player.pokedex,
          GAME_STATES.POKEDEX
        );
        break;
      case WORLDMAP_STATES.PLAYER_POSITION:
        this.game.openPlayerMenu();
        break;
    }
  }

  handlerBlinkForPokemonNests() {
    const blinkProgress = (this.blinkTimer % 60) / 60;

    if (blinkProgress < 0.5) this.blinkOpacity += 0.02;
    else this.blinkOpacity -= 0.02;
  }

  handlerBlinkForPlayerPosition() {
    if (this.blinkTimer % 30 === 0)
      this.isPlayerVisible = !this.isPlayerVisible;
  }

  getHoveredMap(context) {
    return Object.values(MAPS_DATABASE).find((map) => {
      if (!map.worldMap) return false;

      const area = map.worldMap.townArea;
      const cursorCenter = {
        x: this.cursor.position.x + this.cursor.width / 2,
        y: this.cursor.position.y + this.cursor.height / 2,
      };
      const left = area.x * WORLDMAP_CONFIG.tileSize;
      const top = area.y * WORLDMAP_CONFIG.tileSize;
      const right = (area.x + area.w) * WORLDMAP_CONFIG.tileSize;
      const bottom = (area.y + area.h) * WORLDMAP_CONFIG.tileSize;

      // context.strokeStyle = "red";
      // context.strokeRect(
      //   area?.x * WORLDMAP_CONFIG.tileSize,
      //   area?.y * WORLDMAP_CONFIG.tileSize,
      //   area.w * WORLDMAP_CONFIG.tileSize,
      //   area.h * WORLDMAP_CONFIG.tileSize
      // );

      return (
        cursorCenter.x >= left &&
        cursorCenter.x <= right &&
        cursorCenter.y >= top &&
        cursorCenter.y <= bottom
      );
    });
  }

  update(context, action) {
    if (!this.isOpen) return;

    this.blinkTimer++;
    this.handlerBlinkForPokemonNests();

    this.handlerBlinkForPlayerPosition();

    this.draw(context);

    this.cursor.update(context, this.cursor.position.x, this.cursor.position.y);

    const hoveredMap = this.getHoveredMap(context);
    if (hoveredMap) drawText(context, hoveredMap.name, 100, 15);

    switch (this.state) {
      case WORLDMAP_STATES.ENCOUNTER:
        this.showSelectedPokemonAreas(context);
        break;
      case WORLDMAP_STATES.PLAYER_POSITION:
        this.showPlayer(context);
        break;
    }

    if (!this.hasFocus) return;

    switch (action) {
      case INPUT_STATE.ESCAPE:
        this.close();
        break;

      case INPUT_STATE.UP:
        this.cursor.position.y -= 1;
        break;
      case INPUT_STATE.DOWN:
        this.cursor.position.y += 1;
        break;
      case INPUT_STATE.RIGHT:
        this.cursor.position.x += 1;
        break;
      case INPUT_STATE.LEFT:
        this.cursor.position.x -= 1;
        break;
    }
  }
}
