import { WEATHER_STATES } from "../../../logic/gameplay/weather/weatherStates.gameplay.js";
import { RainSystem } from "../rain/RainSystem/RainSystem.model.js";
import { SplashSystem } from "../rain/SplashSystem/SplashSystem.model.js";

export class WeatherManager {
  constructor(game) {
    this.state = WEATHER_STATES.SUN;
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
    this.state = WEATHER_STATES.RAIN;
  }

  stopRain() {
    this.rainSystem.stop();
    this.state = WEATHER_STATES.SUN;
  }

  update(game) {
    const MAP_WEATHER = game.mapManager.currentMap.weathers;
    if (
      MAP_WEATHER?.possibleWeathers.includes(WEATHER_STATES.RAIN) &&
      this.rainSystem.active
    ) {
      this.splashSystem.update(game.canvas.context);
      this.rainSystem.update(game.canvas.context);
    }
  }
}
