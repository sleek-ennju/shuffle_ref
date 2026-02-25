import type { MatchState } from '../matchEngine';

export function teamNameById(state: MatchState, teamId: string | null) {
  if (!teamId) return '—';
  return state.teams.find((t) => t.id === teamId)?.name ?? teamId;
}