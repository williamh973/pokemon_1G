import { generatePokemon } from "../../../logic/gameplay/encounters/generatePokemon.gameplay.js";
import { removeMObyItemId } from "../../utils/list/list.utils.js";
import { POSSIBLE_CHOICES_DATABASE } from "../choices.database.js";

export const STARTER_DIALOG_TREE = {
  setDimension: { width: 32 * 2.4, height: 32 * 2.1 },
  start: {
    setChoices: [POSSIBLE_CHOICES_DATABASE.yes, POSSIBLE_CHOICES_DATABASE.no],
  },
  first: {
    text: "CHEN : Excellent choix !\nIl sera un parfait\ncompagnion !",
    action: (game) => {
      const currentMap = game.mapManager.currentMap;
      const player = game.player;
      let focusedStarter = player.focusedStarter;

      game.mapManager.currentMap.missableObjects = removeMObyItemId(
        currentMap,
        focusedStarter.id
      );

      focusedStarter = {
        ...focusedStarter,
        level: 5,
      };

      const starter = generatePokemon(
        focusedStarter,
        currentMap.name,
        player.nickname,
        "POKEBALL"
      );

      const result = player.party.addPokemonToFirstEmptySlot(starter);

      game.player.pokedex.pokemonList.pokedexState.catch(starter.id);

      game.flags.OAK_LAB.PLAYER_STARTER_CHOSEN_DONE = true;
    },
  },
  second: {
    text: "CHEN : Prend ton temps pour\nfaire le bon choix.",
    action: (game) => {
      game.closeChoiceMenu();
      game.mapManager.currentMap.missableObjects.forEach((item) => {
        if (item.spriteViewer) item.closePokemonViewer();
      });
    },
  },
};
