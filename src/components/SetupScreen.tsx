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
        padding: 24,
        maxWidth: 400,
        margin: '80px auto',
        border: '1px solid #ddd',
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Start Football Session</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>
          Number of Teams
        </label>

        <input
          type="number"
          min={2}
          value={teamCount}
          onChange={(e) => setTeamCount(Number(e.target.value))}
          style={{
            width: '100%',
            padding: 8,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
      )}

      <button
        onClick={handleStart}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Start Session
      </button>
    </div>
  );
}