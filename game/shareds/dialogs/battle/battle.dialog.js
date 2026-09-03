export const BATTLE_DIALOGS = {
  processStatus: (pokemon, status) => `${pokemon} ${status}`,

  statusChanged: (pokemon, status) => ` ${pokemon} est ${status} !`,

  statStageChanged: (stat, pokemon, direction, intensity = "") =>
    ` ${stat} de ${pokemon} \n ${direction} ${intensity} !`,

  statStageChangedNoMore: (stat, pokemon, direction) =>
    `Mais ${stat} de ${pokemon} \nne peut plus ${direction} !`,

  gainExp: (pokemon, expGained) =>
    `${pokemon} a gagné \n${expGained} points d'EXP !`,

  wildPokemonAddedToPokedex: (wildPokemon) =>
    `${wildPokemon} a été ajouté au pokedex !`,

  playerEscape: () => `Vous prenez la fuite !`,

  pokemonUseMove: (pokemon, trainerId, move) =>
    `${pokemon} ${trainerId ? "" : "ennemi "}utilise ${move} !`,

  pokemonKO: (pokemon) => `${pokemon} est K.O !`,

  pokemonMissMove: (pokemon) => `${pokemon} rate son attaque !`,

  wildPokemonEscaped: (pokemon) =>
    `Mince! Le ${pokemon}\nsauvage s'est libéré !`,

  wildPokemonAppears: (pokemon) => `Un ${pokemon} sauvage \napparait !`,

  trainerWantsToFight: (trainer) => `${trainer} veut se battre!`,

  trainerSentOutPokemon: (trainer, pokemon) => `${trainer} envoie ${pokemon} !`,

  returnPokemon: (pokemon) => `${pokemon} reviens !`,

  playerSentOutPokemon: (pokemon) => `${pokemon} ! À toi !`,

  whatShouldPokemonDo: (pokemon) => `Que doit faire\n${pokemon} ?`,

  playerLoseBattle: (player) => `${player} n'a plus \nde pokémon en forme.`,

  trainerDefeated: (player, trainer, pokeDollar) =>
    `${trainer} a été vaincu, ${player} gagne ${pokeDollar} P$`,

  pokemonCaptured: (pokemon) => `${pokemon} est capturé !`,

  pokemonAddedToParty: (pokemon) => `${pokemon} rejoint votre équipe !`,

  pokemonSentToPc: (pokemon) => `${pokemon} a été envoyé au PC.`,

  playerUseBall: (player, item) => `${player} lance une \n${item}!`,
};
