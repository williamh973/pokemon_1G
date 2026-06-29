import { DIALOGS_DATABASE } from "../../../dialogs/dialogs.database.js";

export const palletTownInteractions = [
  {
    type: "sign",
    tile: { x: 11, y: 16 },
    text: DIALOGS_DATABASE.WORLD_DIALOGS.PALLET_TOWN.welcomeSign,
    facing: {
      up: "up",
    },
  },
  {
    type: "sign",
    tile: { x: 7, y: 12 },
    text: DIALOGS_DATABASE.WORLD_DIALOGS.PALLET_TOWN.redHouseSign,
    facing: {
      up: "up",
    },
  },
  {
    type: "sign",
    tile: { x: 16, y: 12 },
    text: DIALOGS_DATABASE.WORLD_DIALOGS.PALLET_TOWN.blueHouseSign,
    facing: {
      up: "up",
    },
  },
  {
    type: "sign",
    tile: { x: 18, y: 21 },
    text: DIALOGS_DATABASE.WORLD_DIALOGS.PALLET_TOWN.oakLabSign,
    facing: {
      up: "up",
    },
  },
];
