export const SCENARIOS_DATABASE = {
  PALLET_TOWN: {
    OAK_BLOCK_EXIT: {
      trigger: {
        type: "POSITION",
        positions: [
          { tileX: 12, tileY: 5 },
          { tileX: 13, tileY: 5 },
        ],
      },
      condition: (game) => !game.flags.PALLET_TOWN.OAK_BLOCK_EXIT_DONE,
      script: "oakBlockExit",
      repeat: false,
    },
  },
  OAK_LAB: {
    OAK_INTRO_LAB: {
      trigger: {
        type: "POSITION",
        positions: [
          { tileX: 4, tileY: 6 },
          { tileX: 5, tileY: 6 },
        ],
      },
      condition: (game) => game.flags.PALLET_TOWN.OAK_ESCORT_DONE,
      script: "oakIntroLab",
      repeat: false,
    },
    BLUE_CHOOSEN_STARTER: {
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
      repeat: false,
    },
    PLAYER_TRY_TO_LEAVE_WITHOUT_STARTER: {
      trigger: {
        type: "POSITION",
        positions: [
          { tileX: 4, tileY: 7 },
          { tileX: 5, tileY: 7 },
        ],
      },
      condition: (game) => {
        if (
          game.flags.OAK_LAB.OAK_INTRO_LAB_DONE &&
          !game.flags.OAK_LAB.BLUE_STARTER_CHOSEN_DONE
        )
          return true;
        else return false;
      },
      script: "playerTryToLeaveWithoutStarter",
      repeat: true,
    },
  },
  RED_HOUSE_1F: {},
  RED_HOUSE_2F: {},
  KANTO_ROUTE_1: {},
};
