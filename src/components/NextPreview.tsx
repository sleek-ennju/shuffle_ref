import type { MatchState } from '../matchEngine';
import { teamNameById } from '../utils/teamNameById';
import { getNextPreview } from '../utils/nextPreview';

type Props = {
  state: MatchState;
};

export default function NextPreview({ state }: Props) {
  const champ = teamNameById(state, state.championId);
  const chall = teamNameById(state, state.challengerId);

  const { nextOpponent, nextIfDraw } = getNextPreview(state);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>What happens next?</h3>

      <div style={{ marginBottom: 6 }}>
        If <strong>{champ}</strong> wins: stays vs <strong>{nextOpponent}</strong>
      </div>

      <div style={{ marginBottom: 6 }}>
        If <strong>{chall}</strong> wins: stays vs <strong>{nextOpponent}</strong>
      </div>

      <div>
        If draw: <strong>{nextIfDraw.a}</strong> vs <strong>{nextIfDraw.b}</strong>
      </div>
    </div>
  );
}