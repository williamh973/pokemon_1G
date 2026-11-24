export const executeNextMultiHit = (turnManager, sequence, action) => {
  turnManager.resetMultiHitState();
  turnManager.deductMultiHitTurns(action);

  turnManager.wait(
    40,
    () => {
      sequence.startMoveSequence(action);
    },
    turnManager.state
  );
};
