import type { MatchState } from '../matchEngine';
import { teamNameById } from '../utils/teamNameById';
import { formatTime } from '../utils/formatTime';

type Props = {
  state: MatchState;
};

export default function MatchHeader({ state }: Props) {
  const championName = teamNameById(state, state.championId);
  const challengerName = teamNameById(state, state.challengerId);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Current Match</h2>

      <p style={{ margin: 0 }}>
        <strong>{championName}</strong> vs <strong>{challengerName}</strong>
      </p>

      <p style={{ margin: '8px 0 0' }}>
        Score: {state.goalsChampion} - {state.goalsChallenger}
      </p>

      <p style={{ margin: '8px 0 0' }}>
        Planned duration: <strong>{state.durationPlanned}</strong> minutes
      </p>

      <p style={{ margin: '8px 0 0' }}>
        Time left: <strong>{formatTime(state.secondsLeft)}</strong>
      </p>

      <p style={{ margin: '8px 0 0' }}>
        Status: <strong>{state.status}</strong>
      </p>
    </div>
  );
}