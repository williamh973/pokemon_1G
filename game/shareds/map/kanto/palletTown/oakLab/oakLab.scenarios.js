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
          tileX: 5,
          tileY: 7,
        },
        {
          tileX: 4,
          tileY: 7,
        },
      ],
    },
    condition: (game) => game.flags.OAK_ESCORT_DONE,
    action: (game) => {
      const FLAGS = game.flags;
      const OAK_LAB = game.mapManager.currentMap;
      const PLAYER = game.player;
      const OAK = game.mapManager.currentMap.npcs.find(
        (npc) => npc.name === "Oak"
      );

      const blueConfig = NPC_DATABASE["blue"];
      const blueDataLoc = { id: "blue", tileX: 4, tileY: 10 };
      const BLUE = spawnNpc(blueConfig, blueDataLoc, OAK_LAB);

      if (PLAYER.tileX === 4 && PLAYER.tileY === 7)
        game.scenarioManager.start([
          move(PLAYER, "up", 1),
          move(PLAYER, "right", 1),
          move(PLAYER, "up", 2),
          face(PLAYER, OAK),
          face(OAK, PLAYER),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWarn),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakInterrupted),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakReply),
          move(BLUE, "up", 6),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakExplain),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakGiveChoice),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueComplains),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWait),
        ]);
      else if (PLAYER.tileX === 5 && PLAYER.tileY === 7)
        game.scenarioManager.start([
          move(PLAYER, "up", 3),
          face(PLAYER, OAK),
          face(OAK, PLAYER),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWarn),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakInterrupted),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakReply),
          move(BLUE, "up", 6),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakExplain),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakGiveChoice),
          dialog(DIALOGS_TREE_DATABASE.oakLab.blueComplains),
          dialog(DIALOGS_TREE_DATABASE.oakLab.oakWait),
        ]);

      FLAGS.OAK_INTRO_LAB = true;
    },
  },
];
