import { getSpeciesData } from "../../../../shareds/utils/pokemon/species/species.utils.js";

const wouldLikeLearn = (pokemon, foundedLearnset) => {
  const wouldLikeLearnText =
    `${pokemon.name} voudrait apprendre\n` +
    `${foundedLearnset.move.name} mais il\n` +
    `possède déjà 4 capacités.\n` +
    `Oublier une capacité pour\n` +
    `apprendre ${foundedLearnset.move.name} ?`;

  return {
    wantsToLearn: true,
    move: foundedLearnset.move,
    text: wouldLikeLearnText,
  };
};

export const replaceMoveDialog = (pokemon, replacedMove, moveToLearn) => {
  const replaceMoveText =
    `${pokemon.name} ne sait plus\n` +
    `comment utiliser ${replacedMove.name}\n` +
    `et ${pokemon.name} apprend ${moveToLearn.name}`;

  return {
    hasReplacedMove: true,
    text: replaceMoveText,
  };
};

const checkMoveAlreadyLearned = (moves, foundedLearnset) => {
  return moves.some((move) => move.id === foundedLearnset.move.id);
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
          learnedMove: true,
          text: learnMoveText,
        };
      }
    }
  } else
    return {
      noLearnset: true,
    };
};
