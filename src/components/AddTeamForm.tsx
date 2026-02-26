import { useState } from 'react';
import type { MatchEvent } from '../matchEngine';

type Props = {
  dispatch: React.Dispatch<MatchEvent>;
};

export default function AddTeamForm({ dispatch }: Props) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();

    dispatch({
      type: 'ADD_TEAM',
      payload: trimmed ? { name: trimmed } : undefined,
    });

    setName('');
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Team name (optional)"
        style={{
          flex: '1 1 220px',
          padding: 8,
          borderRadius: 6,
          border: '1px solid #ccc',
        }}
      />

      <button onClick={handleAdd} style={{ padding: '10px 14px', borderRadius: 6 }}>
        Add Team
      </button>
    </div>
  );
}