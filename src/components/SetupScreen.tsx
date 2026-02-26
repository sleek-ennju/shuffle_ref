import { useState } from 'react';
import type { MatchEvent } from '../matchEngine';

type Props = {
  dispatch: React.Dispatch<MatchEvent>;
};

export default function SetupScreen({ dispatch }: Props) {
  const [teamCount, setTeamCount] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    if (!teamCount || teamCount < 2) {
      setError('You need at least 2 teams.');
      return;
    }

    setError(null);

    dispatch({
      type: 'INIT_SESSION',
      payload: { teamCount },
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        background:
          'radial-gradient(900px 500px at 50% 10%, rgba(59,130,246,0.18), transparent), #0b0f14',
        color: '#fff',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 16,
          padding: 18,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(17, 24, 38, 0.95)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 20, letterSpacing: 0.2 }}>
            Start Football Session
          </h2>
          <p style={{ margin: '6px 0 0', opacity: 0.75, fontSize: 14 }}>
            Enter the number of teams available today.
          </p>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, opacity: 0.85 }}>
            Number of Teams
          </label>

          <input
            type="number"
            min={2}
            value={teamCount}
            onChange={(e) => setTeamCount(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '12px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              outline: 'none',
              fontSize: 16,
            }}
          />
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
            Minimum: 2 teams
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: 10,
              borderRadius: 12,
              border: '1px solid rgba(255,59,48,0.35)',
              background: 'rgba(255,59,48,0.12)',
              color: '#ffd5d2',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 14,
            cursor: 'pointer',
            border: '1px solid rgba(52,199,89,0.28)',
            background: 'rgba(52,199,89,0.18)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 0.2,
          }}
        >
          Start Session
        </button>

        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.6, textAlign: 'center' }}>
          First match is <strong>15 mins</strong>. Others are <strong>10 mins</strong>.
        </div>
      </div>
    </div>
  );
}