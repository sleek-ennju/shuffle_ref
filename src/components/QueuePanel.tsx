import type { MatchState } from '../matchEngine';
import { teamNameById } from '../utils/teamNameById';

type Props = {
  state: MatchState;
};

function Pill({ text }: { text: string }) {
  return (
    <span
      style={{
        padding: '6px 10px',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.06)',
        fontSize: 13,
        fontWeight: 700,
        opacity: 0.92,
      }}
    >
      {text}
    </span>
  );
}

export default function QueuePanel({ state }: Props) {
  const mainQueueNames = state.mainQueue.map((id) => teamNameById(state, id));
  const cooldownNames = state.cooldownQueue.map((id) => teamNameById(state, id));

  const nextUp =
    state.mainQueue.length > 0 ? teamNameById(state, state.mainQueue[0]) : '—';

  const onDeck =
    state.mainQueue.length > 1 ? teamNameById(state, state.mainQueue[1]) : '—';

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        background: 'rgba(17, 24, 38, 0.92)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontWeight: 900, opacity: 0.92 }}>Queues</div>

        <div
          style={{
            fontSize: 12,
            opacity: 0.7,
            padding: '6px 10px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.06)',
            whiteSpace: 'nowrap',
          }}
        >
          Cooldown first rule
        </div>
      </div>

      {/* Next up / On deck */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginTop: 10,
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            border: '1px solid rgba(52,199,89,0.25)',
            background: 'rgba(52,199,89,0.10)',
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
            Next Up
          </div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{nextUp}</div>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
            On Deck
          </div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{onDeck}</div>
        </div>
      </div>

      {/* Main Queue */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8, opacity: 0.92 }}>
          Main Queue <span style={{ opacity: 0.6 }}>({mainQueueNames.length})</span>
        </div>

        {mainQueueNames.length === 0 ? (
          <div style={{ opacity: 0.7, fontSize: 13 }}>—</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {mainQueueNames.map((name, idx) => (
              <Pill key={`${name}-${idx}`} text={name} />
            ))}
          </div>
        )}
      </div>

      {/* Cooldown Queue */}
      <div
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8, opacity: 0.92 }}>
          Cooldown <span style={{ opacity: 0.6 }}>({cooldownNames.length})</span>
        </div>

        {cooldownNames.length === 0 ? (
          <div style={{ opacity: 0.7, fontSize: 13 }}>—</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cooldownNames.map((name, idx) => (
              <Pill key={`${name}-${idx}`} text={name} />
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
        Main queue is used first. When it’s empty, cooldown teams are recycled in order.
      </div>
    </div>
  );
}