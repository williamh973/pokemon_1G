import { dialog } from "../../../../models/ScenarioManager/action/dialog.js";
import { face } from "../../../../models/ScenarioManager/action/facing.js";
import {
  move,
  sequenceMove,
} from "../../../../models/ScenarioManager/action/move.js";
import { NPC_DATABASE } from "../../../character/npc/npc.database.js";
import { DIALOGS_TREE_DATABASE } from "../../../dialogTree/dialogTree.database.js";
import { spawnNpc } from "../../../utils/character/npc/spawnNpc.utils.js";

export const palletTownScenarios = [
  {
    id: "OAK_BLOCK_EXIT",
    hasTriggered: false,
    trigger: {
      type: "POSITION",
      positions: [
        {
          tileX: 8,
          tileY: 6,
        },
        {
          tileX: 9,
          tileY: 6,
        },
      ],
    },
    condition: (game) => !game.flags.PALLET_TOWN.OAK_BLOCK_EXIT_DONE,
    action: (game) => {
      const FLAGS = game.flags.PALLET_TOWN;
      const PALLET_TOWN = game.mapManager.currentMap;
      const PLAYER = game.player;

      const oakConfig = NPC_DATABASE["oak"];
      const oakDataLoc = { id: "oak", tileX: 8, tileY: 11 };
      const OAK = spawnNpc(oakConfig, oakDataLoc, PALLET_TOWN);

      if (PLAYER.tileX === 8 && PLAYER.tileY === 6)
        game.scenarioManager.start([
          dialog(DIALOGS_TREE_DATABASE.palletTown.oakBlockRed),
          move(OAK, "up", 4),
          move(OAK, "right", 1),
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
      else if (PLAYER.tileX === 9 && PLAYER.tileY === 6)
        game.scenarioManager.start([
          dialog(DIALOGS_TREE_DATABASE.palletTown.oakBlockRed),
          move(OAK, "up", 5),
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
];
