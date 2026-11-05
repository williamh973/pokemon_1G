export const BATTLE_DIALOGS = {
  dig: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}\ns'enfonce dans le sol.`,

  shining: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}brille.`,

  setBack: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}prend du recul.`,

  takeOff: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}s'envole.`,

  toBeExhausted: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}est à plat.`,

  superEffective: () => `C'est super efficace !`,

  notVeryEffective: () => `Ce n'est pas très efficace !`,

  ineffective: (pokemon, trainerId) =>
    `Cela n'affecte pas ${pokemon} ${trainerId ? "" : "\nennemi."}`,

  confusedNoMore: (pokemon, trainerId) =>
    `${pokemon}  ${trainerId ? "" : "ennemi "}\nn'est plus confus.`,

  confusionDeals: () => `La confusion lui inflige des\ndégâts.`,

  confusing: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}\nest confus.`,

  becomesConfusing: (pokemon, trainerId) =>
    `Cela rend ${pokemon} \n${trainerId ? "" : "ennemi "}confus.`,

  drain: (pokemon, trainerId) =>
    `La vie de ${pokemon} \n${trainerId ? "" : "ennemi "}est aspiré.`,

  noEffect: () => "Sans effet.",

  boostedByFocusEnergy: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}se gonfle.`,

  criticalHit: () => "Coup critique !",

  thawedOut: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}est dégelé !`,

  wokenUp: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}se réveille !`,

  alreadyAsleep: (pokemon, trainerId) =>
    `Mais ${pokemon} ${trainerId ? "" : "ennemi "}\nest déjà endormis !`,

  processStatus: (pokemon, trainerId, status) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}${status}`,

  statusChanged: (pokemon, trainerId, status) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}\nest ${status} !`,

  statStageChanged: (stat, pokemon, trainerId, direction, intensity = "") =>
    `${stat} de ${pokemon} ${
      trainerId ? "" : "ennemi "
    }\n${direction} ${intensity} !`,

  statStageChangedNoMore: (stat, pokemon, trainerId, direction) =>
    `Mais ${stat} de ${pokemon}\n${
      trainerId ? "" : "ennemi "
    }ne peut plus ${direction} !`,

  gainExp: (pokemon, expGained) =>
    `${pokemon} a gagné \n${expGained} points d'EXP !`,

  wildPokemonAddedToPokedex: (wildPokemon) =>
    `${wildPokemon} a été ajouté au pokedex !`,

  playerEscape: () => `Vous prenez la fuite !`,

  pokemonUseMove: (pokemon, trainerId, move) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}utilise\n${move} !`,

  pokemonKO: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}\nest K.O !`,

  pokemonMissMove: (pokemon, trainerId) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}\nrate son attaque !`,

  wildPokemonEscaped: (pokemon) =>
    `Mince! Le ${pokemon}\nsauvage s'est libéré !`,

  wildPokemonAppears: (pokemon) => `Un ${pokemon} sauvage \napparait !`,

  trainerWantsToFight: (trainer) => `${trainer} veut se battre!`,

  trainerSentOutPokemon: (trainer, pokemon) => `${trainer} envoie ${pokemon} !`,

  returnPokemon: (pokemon) => `${pokemon} reviens !`,

  playerSentOutPokemon: (pokemon) => `${pokemon} ! À toi !`,

  whatShouldPokemonDo: (pokemon) => `Que doit faire\n${pokemon} ?`,

  playerLoseBattle: (player) => `${player} n'a plus \nde pokémon en forme.`,

  wantsToChooseOtherPokemon: () => `Choisir quel pokémon ?`,

  trainerDefeated: (player, trainer, pokeDollar) =>
    `${trainer} a été vaincu, ${player} gagne ${pokeDollar} P$`,

  pokemonCaptured: (pokemon) => `${pokemon} est capturé !`,

  pokemonAddedToParty: (pokemon) => `${pokemon} rejoint votre équipe !`,

  pokemonSentToPc: (pokemon) => `${pokemon} a été envoyé au PC.`,

  playerUseBall: (player, item) => `${player} lance une \n${item}!`,
};
