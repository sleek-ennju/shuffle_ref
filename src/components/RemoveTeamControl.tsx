import { useMemo, useState } from 'react';
import type { MatchEvent, MatchState } from '../matchEngine';

type Props = {
  state: MatchState;
  dispatch: React.Dispatch<MatchEvent>;
};

export default function RemoveTeamControl({ state, dispatch }: Props) {
  const [selectedId, setSelectedId] = useState<string>('');

  const options = useMemo(() => {
    return state.teams.map((t) => ({ id: t.id, name: t.name }));
  }, [state.teams]);

  const handleRemove = () => {
    if (!selectedId) return;

    dispatch({
      type: 'REMOVE_TEAM',
      payload: { teamId: selectedId },
    });

    setSelectedId('');
  };

  const disabled = options.length === 0;

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
      <div style={{ fontWeight: 600 }}>Remove Team</div>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        disabled={disabled}
        style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
      >
        <option value="">Select team...</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleRemove}
        disabled={!selectedId}
        style={{ padding: '10px 14px', borderRadius: 6 }}
      >
        Remove
      </button>
    </div>
  );
}