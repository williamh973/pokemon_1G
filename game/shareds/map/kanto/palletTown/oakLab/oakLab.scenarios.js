import { behavior } from "../../../../../models/ScenarioManager/action/behavior.js";
import { dialog } from "../../../../../models/ScenarioManager/action/dialog.js";
import { face } from "../../../../../models/ScenarioManager/action/facing.js";
import { move } from "../../../../../models/ScenarioManager/action/move.js";
import { NPC_DATABASE } from "../../../../character/npc/npc.database.js";
import { DIALOGS_TREE_DATABASE } from "../../../../dialogTree/dialogTree.database.js";
import { spawnNpc } from "../../../../utils/character/npc/spawnNpc.utils.js";

export const oakLabScenarios = [
  {
    id: "OAK_INTRO_LAB",
    hasTriggered: false,
    trigger: {
      type: "POSITION",
      positions: [
        {
          tileX: 4,
          tileY: 7,
        },
        {
          tileX: 5,
          tileY: 7,
        },
      ],
    },
    condition: (game) => game.flags.PALLET_TOWN.OAK_ESCORT_DONE,
    action: (game) => {
      const FLAGS = game.flags.OAK_LAB;
      const OAK_LAB = game.mapManager.currentMap;
      const PLAYER = game.player;
      const OAK = game.mapManager.currentMap.npcs.find(
        (npc) => npc.name === "Oak"
      );

      const blueConfig = NPC_DATABASE["blue"];
      const blueDataLoc = { id: "blue", tileX: 4, tileY: 13 };
      const BLUE = spawnNpc(blueConfig, blueDataLoc, OAK_LAB);

      FLAGS.OAK_INTRO_LAB_DONE = true;

      if (PLAYER.tileX === 4 && PLAYER.tileY === 7)
        game.scenarioManager.start([
          move(PLAYER, "up", 1),
          move(PLAYER, "right", 1),
          move(PLAYER, "up", 2),
          face(PLAYER, OAK),
          face(OAK, PLAYER),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWarn),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakInterrupted),
          move(BLUE, "up", 9),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakReply),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakExplain),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakGiveChoice),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueComplains),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWait),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueReaction),
          behavior(BLUE, "lookAround"),
        ]);
      else if (PLAYER.tileX === 5 && PLAYER.tileY === 7)
        game.scenarioManager.start([
          move(PLAYER, "up", 3),
          face(PLAYER, OAK),
          face(OAK, PLAYER),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWarn),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakInterrupted),
          move(BLUE, "up", 9),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakReply),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakExplain),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakGiveChoice),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueComplains),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWait),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueReaction),
          behavior(BLUE, "lookAround"),
        ]);
    },
  },
  {
    id: "CHOOSEN_STARTER",
    hasTriggered: false,
    trigger: {
      type: "POSITION",
      positions: [
        {
          tileX: 6,
          tileY: 4,
        },
        {
          tileX: 7,
          tileY: 4,
        },
        {
          tileX: 8,
          tileY: 4,
        },
      ],
    },
    condition: (game) => game.flags.OAK_LAB.STARTER_CHOSEN_DONE,
    action: (game) => {
      console.log("passe dans le scénario");

      const FLAGS = game.flags;
      const OAK_LAB = game.mapManager.currentMap;
      const PLAYER = game.player;
      const OAK = game.mapManager.currentMap.npcs.find(
        (npc) => npc.name === "Oak"
      );
      const BLUE = game.mapManager.currentMap.npcs.find(
        (npc) => npc.name === "Blue"
      );

      if (PLAYER.tileX === 6 && PLAYER.tileY === 4)
        game.scenarioManager.start([
          behavior(BLUE, "static"),
          move(BLUE, "down", 1),
          move(BLUE, "right", 3),
          move(BLUE, "up", 1),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueChooseStarter),
          behavior(BLUE, "lookAround"),
        ]);
      else if (PLAYER.tileX === 7 && PLAYER.tileY === 4)
        game.scenarioManager.start([
          behavior(BLUE, "static"),
          move(BLUE, "down", 1),
          move(BLUE, "right", 4),
          move(BLUE, "up", 1),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueChooseStarter),
          behavior(BLUE, "lookAround"),
        ]);
      else if (PLAYER.tileX === 8 && PLAYER.tileY === 4)
        game.scenarioManager.start([
          behavior(BLUE, "static"),
          move(BLUE, "down", 1),
          move(BLUE, "right", 2),
          move(BLUE, "up", 1),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueChooseStarter),
          behavior(BLUE, "lookAround"),
        ]);
    },
  },
];
