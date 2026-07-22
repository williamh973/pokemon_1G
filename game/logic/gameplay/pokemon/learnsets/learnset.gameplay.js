import { getSpeciesData } from "../../../../shareds/utils/pokemon/species/species.utils.js";

const wouldLikeLearn = (pokemon, foundedLearnset) => {
  const wouldLikeLearnText = `${pokemon.name} voudrait apprendre \n ${foundedLearnset?.move.name} \n mais ${pokemon.name} possède déjà 4 capacités.`;
  return {
    success: false,
    text: wouldLikeLearnText,
  };
};

const checkMoveAlreadyLearned = (moves, foundedLearnset) => {
  const pokemonAlreadyHasMove = moves.filter(
    (move) => move.id === foundedLearnset.move.id
  );
  if (pokemonAlreadyHasMove.length === 1) {
    return true;
  } else return false;
};

export const checkLearnset = (pokemon) => {
  const SPECIES = getSpeciesData(pokemon.id);
  const learnsets = SPECIES.learnset.levelUp;

  const foundedLearnset = learnsets.find(
    (learnset) => learnset.level === pokemon.level
  );
  const moves = pokemon.moves;

  if (foundedLearnset) {
    if (moves.length >= 4) {
      const wouldLikeLearnTheMove = wouldLikeLearn(pokemon, foundedLearnset);
      return wouldLikeLearnTheMove;
    } else {
      const alreadyLearned = checkMoveAlreadyLearned(moves, foundedLearnset);
      if (alreadyLearned)
        return {
          success: false,
          noLearnset: true,
        };
      else {
        moves.push({
          id: foundedLearnset.move.id,
          name: foundedLearnset.move.name,
          type: foundedLearnset.move.type,
          class: foundedLearnset.move.class,
          currentPP: foundedLearnset.move.pp,
          maxPP: foundedLearnset.move.pp,
          power: foundedLearnset.move.power,
          precision: foundedLearnset.move.precision,
          desc: foundedLearnset.move.desc,
        });

        const learnMoveText = `${pokemon.name} apprend ${foundedLearnset?.move.name} !`;

        return {
          success: true,
          text: learnMoveText,
          noLearnset: false,
        };
      }
    }
  } else
    return {
      success: false,
      noLearnset: true,
    };
};
