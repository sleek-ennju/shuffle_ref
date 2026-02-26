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
    <div className="stickyBar">
      <div className="stickyInner">
        <button className="btn primary" disabled={!canStart} onClick={() => dispatch({ type: 'START_MATCH' })}>
          Start
        </button>

        <button className="btn" disabled={!canPause} onClick={() => dispatch({ type: 'PAUSE_MATCH' })}>
          Pause
        </button>

        <button className="btn" disabled={!canResume} onClick={() => dispatch({ type: 'RESUME_MATCH' })}>
          Resume
        </button>

        <button className="btn danger" disabled={!canEnd} onClick={() => dispatch({ type: 'END_MATCH', payload: { reason: 'refStop' } })}>
          End
        </button>
      </div>
    </div>
  );
}