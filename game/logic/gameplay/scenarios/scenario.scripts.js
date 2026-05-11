import { behavior } from "../../../models/ScenarioManager/action/behavior.js";
import { dialog } from "../../../models/ScenarioManager/action/dialog.js";
import { face } from "../../../models/ScenarioManager/action/facing.js";
import {
  move,
  sequenceMove,
} from "../../../models/ScenarioManager/action/move.js";
import { NPC_DATABASE } from "../../../shareds/character/npc/npc.database.js";
import { NPC_LOCATION } from "../../../shareds/character/npc/npcLocation.database.js";
import { DIALOGS_TREE_DATABASE } from "../../../shareds/dialogTree/dialogTree.database.js";
import { spawnNpc } from "../../../shareds/utils/character/npc/spawnNpc.utils.js";

export const SCENARIO_SCRIPTS = {
  PALLET_TOWN: {
    oakBlockExit(game) {
      const FLAGS = game.flags.PALLET_TOWN;
      const PALLET_TOWN = game.mapManager.currentMap;
      const PLAYER = game.player;

      const oakConfig = NPC_DATABASE["oak"];
      const oakDataLoc = { id: "oak", tileX: 14, tileY: 11 };
      const OAK = spawnNpc(oakConfig, oakDataLoc, PALLET_TOWN);

      if (PLAYER.tileX === 12 && PLAYER.tileY === 5) {
        game.scenarioManager.start([
          dialog(DIALOGS_TREE_DATABASE.palletTown.oakBlockRed),
          move(OAK, "up", 4),
          move(OAK, "left", 2),
          move(OAK, "up", 1),
          face(PLAYER, OAK),
          face(OAK, PLAYER),
          dialog(DIALOGS_TREE_DATABASE.palletTown.oakJoinedRed),
          sequenceMove(
            OAK,
            OAK.paths.scenarioPaths.palletTown.escortPlayerToLab_A,
            PLAYER,
            PLAYER.paths.scenarioPaths.palletTown.escortedByOak_A
          ),
        ]);
      } else if (PLAYER.tileX === 13 && PLAYER.tileY === 5)
        game.scenarioManager.start([
          dialog(DIALOGS_TREE_DATABASE.palletTown.oakBlockRed),
          move(OAK, "up", 4),
          move(OAK, "left", 1),
          move(OAK, "up", 1),
          face(PLAYER, OAK),
          face(OAK, PLAYER),
          dialog(DIALOGS_TREE_DATABASE.palletTown.oakJoinedRed),
          sequenceMove(
            OAK,
            OAK.paths.scenarioPaths.palletTown.escortPlayerToLab_B,
            PLAYER,
            PLAYER.paths.scenarioPaths.palletTown.escortedByOak_B
          ),
        ]);

      FLAGS.OAK_BLOCK_EXIT_DONE = true;
      FLAGS.OAK_ESCORT_DONE = true;
    },
  },
  OAK_LAB: {
    oakIntroLab(game) {
      const FLAGS = game.flags.OAK_LAB;
      const MAP = game.mapManager.currentMap;
      const PLAYER = game.player;
      const OAK = game.mapManager.currentMap.npcs.find(
        (npc) => npc.name === "Oak"
      );
      const npcLocation = NPC_LOCATION[MAP.id];
      const blueConfig = NPC_DATABASE["blue"];
      const blueDataLoc = { id: "blue", tileX: 4, tileY: 11 };
      npcLocation.push(blueDataLoc);
      const BLUE = spawnNpc(blueConfig, blueDataLoc, MAP);

      FLAGS.OAK_INTRO_LAB_DONE = true;

      if (PLAYER.tileX === 4 && PLAYER.tileY === 6)
        game.scenarioManager.start([
          move(PLAYER, "up", 1),
          move(PLAYER, "right", 1),
          move(PLAYER, "up", 1),
          face(PLAYER, OAK),
          face(OAK, PLAYER),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWarn),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakInterrupted),
          move(BLUE, "up", 7),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakReply),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakExplain),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakGiveChoice),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueComplains),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWait),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueReaction),
          behavior(BLUE, "lookAround"),
        ]);
      else if (PLAYER.tileX === 5 && PLAYER.tileY === 6)
        game.scenarioManager.start([
          move(PLAYER, "up", 2),
          face(PLAYER, OAK),
          face(OAK, PLAYER),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWarn),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakInterrupted),
          move(BLUE, "up", 7),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakReply),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakExplain),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakGiveChoice),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueComplains),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWait),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueReaction),
          behavior(BLUE, "lookAround"),
        ]);
    },
    blueChooseStarter(game) {
      const FLAGS = game.flags;
      const PLAYER = game.player;
      const BLUE = game.mapManager.currentMap.npcs.find(
        (npc) => npc.name === "Blue"
      );
      const BULBASAUR = game.mapManager.currentMap.missableObjects.find(
        (mo) => mo.itemId === "BULBASAUR"
      );

      FLAGS.OAK_LAB.BLUE_STARTER_CHOSEN_DONE = true;

      if (PLAYER.tileX === 7 && PLAYER.tileY === 5)
        game.scenarioManager.start([
          behavior(BLUE, "static"),
          move(BLUE, "down", 2),
          move(BLUE, "right", 4),
          move(BLUE, "up", 1),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueChooseStarter),
          behavior(BLUE, "lookAround"),
        ]);
      else if (PLAYER.tileX === 8 && PLAYER.tileY === 5)
        game.scenarioManager.start([
          behavior(BLUE, "static"),
          move(BLUE, "down", 2),
          move(BLUE, "right", 5),
          move(BLUE, "up", 1),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueChooseStarter),
          behavior(BLUE, "lookAround"),
        ]);
      else if (PLAYER.tileX === 9 && PLAYER.tileY === 5)
        game.scenarioManager.start([
          behavior(BLUE, "static"),
          move(BLUE, "down", 1),
          move(BLUE, "right", 3),
          face(BLUE, BULBASAUR),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueChooseStarter),
          behavior(BLUE, "lookAround"),
        ]);
    },
    playerTryToLeaveWithoutStarter(game) {
      const FLAGS = game.flags;
      const PLAYER = game.player;

      FLAGS.OAK_LAB.PLAYER_TRY_TO_LEAVE_WITHOUT_STARTER = true;

      if (
        PLAYER.tileX === 4 &&
        PLAYER.tileY === 7 &&
        !FLAGS.OAK_LAB.BLUE_STARTER_CHOSEN_DONE
      )
        game.scenarioManager.start([
          dialog(DIALOGS_TREE_DATABASE.oakLab.playerTryToExit),
          move(PLAYER, "up"),
        ]);
      else if (
        PLAYER.tileX === 5 &&
        PLAYER.tileY === 7 &&
        !FLAGS.OAK_LAB.BLUE_STARTER_CHOSEN_DONE
      )
        game.scenarioManager.start([
          dialog(DIALOGS_TREE_DATABASE.oakLab.playerTryToExit),
          move(PLAYER, "up"),
        ]);
    },
  },
};
