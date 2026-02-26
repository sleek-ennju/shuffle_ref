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

  const selectedName = useMemo(() => {
    return options.find((o) => o.id === selectedId)?.name ?? '';
  }, [options, selectedId]);

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
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        background: 'rgba(17, 24, 38, 0.92)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 8, opacity: 0.92 }}>
        Remove Team
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={disabled}
          style={{
            flex: '1 1 240px',
            padding: '12px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            outline: 'none',
            fontSize: 15,
            appearance: 'none',
          }}
        >
          <option value="" style={{ color: '#000' }}>
            Select team...
          </option>

          {options.map((o) => (
            <option key={o.id} value={o.id} style={{ color: '#000' }}>
              {o.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleRemove}
          disabled={!selectedId}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            cursor: 'pointer',
            border: '1px solid rgba(255,59,48,0.35)',
            background: !selectedId ? 'rgba(255,59,48,0.10)' : 'rgba(255,59,48,0.18)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 0.2,
            minWidth: 120,
            opacity: !selectedId ? 0.5 : 1,
          }}
        >
          Remove
        </button>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        {selectedId ? (
          <>
            You are about to remove <strong>{selectedName}</strong>. This may affect
            the current match if they are playing.
          </>
        ) : (
          <>Select a team to remove.</>
        )}
      </div>
    </div>
  );
}