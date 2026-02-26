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

  const hasMatch = !!state.championId && !!state.challengerId;

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
        <div style={{ fontWeight: 900, opacity: 0.92 }}>What happens next?</div>
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
          Main queue first
        </div>
      </div>

      {!hasMatch ? (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13 }}>
          Start a session to see next-match predictions.
        </div>
      ) : (
        <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
          {/* Champion wins */}
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
              If <strong>{champ}</strong> wins
            </div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>
              {champ} <span style={{ opacity: 0.65 }}>stays vs</span>{' '}
              <span style={{ color: '#fff' }}>{nextOpponent}</span>
            </div>
          </div>

          {/* Challenger wins */}
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
              If <strong>{chall}</strong> wins
            </div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>
              {chall} <span style={{ opacity: 0.65 }}>stays vs</span>{' '}
              <span style={{ color: '#fff' }}>{nextOpponent}</span>
            </div>
          </div>

          {/* Draw */}
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
              If draw
            </div>
            <div style={{ fontSize: 15, fontWeight: 900 }}>
              {nextIfDraw.a}{' '}
              <span style={{ opacity: 0.65, fontWeight: 700 }}>vs</span>{' '}
              {nextIfDraw.b}
            </div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.65 }}>
            Note: If main queue is empty, cooldown teams are recycled in order.
          </div>
        </div>
      )}
    </div>
  );
}