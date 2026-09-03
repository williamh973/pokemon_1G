import { POKEMON_STATUS } from "../../../pokemon/status/pokemonStatus.state.js";

export const applyStatusEffect = (action) => {
  if (
    action.move.effect?.type === "STATUS" &&
    action.target.status === POKEMON_STATUS.NONE
  ) {
    const random100 = Math.floor(Math.random() * 100) + 1;
    if (random100 > action.move.effect.percentage) return;

    action.target.status = action.move.effect.status;

    return {
      isAffected: true,
      status: action.move.effect.status,
      pokemon: action.target,
    };
  }
};
