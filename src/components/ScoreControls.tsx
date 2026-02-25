import type { MatchEvent, MatchState } from '../matchEngine';

type Props = {
  state: MatchState;
  dispatch: React.Dispatch<MatchEvent>;
};

export default function ScoreControls({ state, dispatch }: Props) {
  const disabled = !state.championId || !state.challengerId;

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
      <button
        disabled={disabled}
        onClick={() => dispatch({ type: 'GOAL_CHAMPION' })}
      >
        Goal Champion
      </button>

      <button
        disabled={disabled}
        onClick={() => dispatch({ type: 'GOAL_CHALLENGER' })}
      >
        Goal Challenger
      </button>
    </div>
  );
}