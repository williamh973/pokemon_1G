export const SCENARIOS_DATABASE = {
  PALLET_TOWN: {
    OAK_BLOCK_EXIT: {
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
      script: "oakBlockExit",
    },
  },
  OAK_LAB: {
    OAK_INTRO_LAB: {
      hasTriggered: false,
      trigger: {
        type: "POSITION",
        positions: [
          { tileX: 4, tileY: 6 },
          { tileX: 5, tileY: 6 },
        ],
      },

      condition: (game) => !game.flags.OAK_LAB.OAK_ESCORT_DONE,
      script: "oakIntroLab",
    },
    BLUE_CHOOSEN_STARTER: {
      hasTriggered: false,
      trigger: {
        type: "POSITION",
        positions: [
          { tileX: 6, tileY: 4 },
          { tileX: 7, tileY: 4 },
          { tileX: 8, tileY: 4 },
        ],
      },

      condition: (game) => game.flags.OAK_LAB.PLAYER_STARTER_CHOSEN_DONE,
      script: "blueChooseStarter",
    },
    PLAYER_TRY_TO_LEAVE_WITHOUT_STARTER: {
      hasTriggered: false,
      trigger: {
        type: "POSITION",
        positions: [
          { tileX: 4, tileY: 7 },
          { tileX: 5, tileY: 7 },
        ],
      },

      condition: (game) => game.flags.OAK_LAB.OAK_INTRO_LAB_DONE,
      script: "playerTryToLeaveWithoutStarter",
    },
  },
};
