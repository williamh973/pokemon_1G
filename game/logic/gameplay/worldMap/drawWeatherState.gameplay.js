import { drawText } from "../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../shareds/utils/font/font.utils.js";
import { WEATHER_STATES } from "../weather/weatherStates.gameplay.js";

export const drawWeatherState = (context, worldMap) => {
  textParams(context, "20", "whitesmoke");
  switch (worldMap.game.weatherManager.state) {
    case WEATHER_STATES.SUN:
      drawText(context, "Ensoleillé", 16, 290);
      break;
    case WEATHER_STATES.RAIN:
      drawText(context, "Pluvieux", 16, 290);
      break;
  }
};
