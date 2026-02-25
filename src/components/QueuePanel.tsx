import type { MatchState } from '../matchEngine';
import { teamNameById } from '../utils/teamNameById';

type Props = {
  state: MatchState;
};

export default function QueuePanel({ state }: Props) {
  const mainQueueNames = state.mainQueue.map((id) => teamNameById(state, id));
  const cooldownNames = state.cooldownQueue.map((id) => teamNameById(state, id));

  const nextUp = state.mainQueue.length > 0 ? teamNameById(state, state.mainQueue[0]) : '—';

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Queues</h2>

      <p style={{ margin: '0 0 10px' }}>
        Next up: <strong>{nextUp}</strong>
      </p>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Main Queue</div>
        {mainQueueNames.length === 0 ? (
          <div>—</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {mainQueueNames.map((name, idx) => (
              <span
                key={`${name}-${idx}`}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: 999,
                }}
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Cooldown Queue</div>
        {cooldownNames.length === 0 ? (
          <div>—</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cooldownNames.map((name, idx) => (
              <span
                key={`${name}-${idx}`}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: 999,
                }}
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}