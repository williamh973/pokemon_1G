import { RainSystem } from "../rain/RainSystem/RainSystem.model.js";
import { SplashSystem } from "../rain/SplashSystem/SplashSystem.model.js";

export class WeatherManager {
  constructor(game) {
    this.rainSystem = new RainSystem(game.canvas);
    this.splashSystem = new SplashSystem();
  }

  onMapChanged(map) {
    this.stopRain();

    if (Math.random() * 100 >= map.weathers?.rainRate || map.isIndoor) return;

    this.startRain();
  }

  startRain() {
    this.rainSystem.start(1);
  }

  stopRain() {
    this.rainSystem.stop();
  }

  update(game) {
    const MAP_WEATHER = game.mapManager.currentMap.weathers;
    if (
      MAP_WEATHER?.possibleWeathers.includes("rain") &&
      this.rainSystem.active
    ) {
      this.splashSystem.update(game.canvas.context);
      this.rainSystem.update(game.canvas.context);
    }
  }
}
