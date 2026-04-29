export class EncounterManager {
  getEncounter(map, tile, timeManager) {
    if (!tile.encounter) return;

    const zone = map.encounter[tile.terrain];

    const encounters = this.getEncountersForTime(zone, timeManager);

    return this.rollEncounter(encounters, map.encounterRate);
  }

  getEncountersForTime(encounters, timeManager) {
    if (timeManager.isNight()) return encounters.night ?? encounters.day;

    return encounters.day;
  }

  getRandomN() {
    return Math.random() * 100;
  }

  getRandomLevel(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rollEncounter(encounters, encounterRate) {
    let randomN = this.getRandomN();
    if (randomN >= encounterRate) return;

    randomN = this.getRandomN();
    let sum = 0;

    for (const encounter of encounters) {
      sum += encounter.rate;

      if (randomN <= sum)
        return {
          ...encounter,
          level: this.getRandomLevel(encounter.minLevel, encounter.maxLevel),
        };
    }

    return null;
  }
}
