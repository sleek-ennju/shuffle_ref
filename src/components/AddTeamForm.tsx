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

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

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
      <div style={{ fontWeight: 700, marginBottom: 8, opacity: 0.92 }}>
        Add Team
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Team name (optional) e.g. F"
          style={{
            flex: '1 1 240px',
            padding: '12px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            outline: 'none',
            fontSize: 15,
          }}
        />

        <button
          onClick={handleAdd}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            cursor: 'pointer',
            border: '1px solid rgba(59,130,246,0.28)',
            background: 'rgba(59,130,246,0.18)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 0.2,
            minWidth: 120,
          }}
        >
          Add
        </button>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>
        Tip: press <strong>Enter</strong> to add quickly.
      </div>
    </div>
  );
}