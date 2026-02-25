import type { MatchEvent, MatchState } from '../matchEngine';

type Props = {
  state: MatchState;
  dispatch: React.Dispatch<MatchEvent>;
};

export default function MatchControls({ state, dispatch }: Props) {
  const hasMatch = !!state.championId && !!state.challengerId;

  const canStart = hasMatch && (state.status === 'idle' || state.status === 'ended');
  const canPause = state.status === 'running';
  const canResume = state.status === 'paused';
  const canEnd = hasMatch && (state.status === 'running' || state.status === 'paused');

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
      <button disabled={!canStart} onClick={() => dispatch({ type: 'START_MATCH' })}>
        Start
      </button>

      <button disabled={!canPause} onClick={() => dispatch({ type: 'PAUSE_MATCH' })}>
        Pause
      </button>

      <button disabled={!canResume} onClick={() => dispatch({ type: 'RESUME_MATCH' })}>
        Resume
      </button>

      <button
        disabled={!canEnd}
        onClick={() => dispatch({ type: 'END_MATCH', payload: { reason: 'refStop' } })}
      >
        End Match
      </button>
    </div>
  );
}