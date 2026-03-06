import { Npc } from "../../../../models/Character/Npc/npc.model.js";
import { NPC_DATABASE } from "../../../character/npc/npc.database.js";
import { NPC_LOCATION } from "../../../character/npc/npcLocation.database.js";
import { DIALOGS_TREE_DATABASE } from "../../../dialogTree/dialogTree.database.js";

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
    condition: (game) => !game.flags.OAK_BLOCK_EXIT_DONE,
    action: (game) => {
      const FLAGS = game.flags;
      const PALLET_TOWN = game.mapManager.currentMap;
      const PLAYER = game.player;
      let palletTownNPCs = NPC_LOCATION[PALLET_TOWN.id];

      FLAGS.OAK_BLOCK_EXIT_DONE = true;

      palletTownNPCs.push({ id: "oak", tileX: 8, tileY: 11 });
      const oakConfig = NPC_DATABASE["oak"];
      const OAK = new Npc({
        tileX: 8,
        tileY: 11,
        sprites: oakConfig.sprites,
        facing: oakConfig.facing,
        name: oakConfig.name,
        dialogTree: oakConfig.dialogTree,
        behavior: oakConfig.behavior,
        patrolPath: oakConfig.patrolPath,
      });

      PALLET_TOWN.npcs.push(OAK);

      game.openDialogBox(DIALOGS_TREE_DATABASE.palletTown.oak.start.text);

      if (PLAYER.tileX === 8 && PLAYER.tileY === 6)
        OAK.startForcedMovement(oakConfig.paths.fromLabToplayer_A);
      else if (PLAYER.tileX === 9 && PLAYER.tileY === 6)
        OAK.startForcedMovement(oakConfig.paths.fromLabToplayer_B);

      OAK.addMovementCallback(() => {
        PLAYER.setFacing(PLAYER.getFacingToward(OAK));
        OAK.setFacing(OAK.getFacingToward(PLAYER));
        FLAGS.OAK_JOIN_RED = true;

        // game.openDialogBox met le jeu en pause OAK.startForcedMovement(oakConfig.paths.escortPlayerToLab_A); est déclenché, ce qui provoque le facing down
        game.openDialogBox(
          DIALOGS_TREE_DATABASE.palletTown.oak.next.text,
          null,
          () => {
            if (PLAYER.tileX === 8 && PLAYER.tileY === 6) {
              OAK.startForcedMovement(oakConfig.paths.escortPlayerToLab_A);
              PLAYER.startForcedMovement(PLAYER.paths.escortedByOak_A);
            } else if (PLAYER.tileX === 9 && PLAYER.tileY === 6) {
              OAK.startForcedMovement(oakConfig.paths.escortPlayerToLab_B);
              PLAYER.startForcedMovement(PLAYER.paths.escortedByOak_B);
            }

            OAK.addMovementCallback(() => {
              NPC_LOCATION.PALLET_TOWN = NPC_LOCATION.PALLET_TOWN.filter(
                (npc) => npc.id !== "oak"
              );

              game.mapManager.currentMap.npcs =
                game.mapManager.currentMap.npcs.filter(
                  (npc) => npc.name !== "Oak"
                );

              FLAGS.OAK_ESCORT_DONE = true;
            });
          }
        );
      });
    },
  },
];
