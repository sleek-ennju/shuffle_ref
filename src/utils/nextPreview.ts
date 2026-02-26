import type { MatchState } from '../matchEngine';
import { teamNameById } from './teamNameById';

export function getNextPreview(state: MatchState) {
  const pickNextOne = () => {
    const id = state.mainQueue[0] ?? state.cooldownQueue[0] ?? null;
    return teamNameById(state, id);
  };

  const pickNextTwo = () => {
    const combined =
      state.mainQueue.length >= 2
        ? [...state.mainQueue]
        : [...state.mainQueue, ...state.cooldownQueue];

    const aId = combined[0] ?? null;
    const bId = combined[1] ?? null;

    return {
      a: teamNameById(state, aId),
      b: teamNameById(state, bId),
    };
  };

  return {
    nextOpponent: pickNextOne(),
    nextIfDraw: pickNextTwo(),
  };
}