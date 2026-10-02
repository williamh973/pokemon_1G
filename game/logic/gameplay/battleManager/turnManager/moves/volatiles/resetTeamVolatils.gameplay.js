export const resetTeamVolatils = (party) => {
  party.slots.forEach((slot) => {
    if (!slot.content) return;
    slot.content.volatils.recharge = false;
  });
};
