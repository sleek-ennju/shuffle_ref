import type { MatchEvent, MatchState } from '../matchEngine';

type Props = {
  state: MatchState;
  dispatch: React.Dispatch<MatchEvent>;
};

export default function ScoreControls({ state, dispatch }: Props) {
  const disabled = !state.championId || !state.challengerId;

  return (
    <div className="card">
      <div className="title">Goals</div>
      <div className="btnRow">
        <button
          className="btn"
          disabled={disabled}
          onClick={() => dispatch({ type: 'GOAL_CHAMPION' })}
        >
          + Goal (Champion)
        </button>

        <button
          className="btn"
          disabled={disabled}
          onClick={() => dispatch({ type: 'GOAL_CHALLENGER' })}
        >
          + Goal (Challenger)
        </button>
      </div>
      <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
        Match auto-ends on a 2-goal lead.
      </div>
    </div>
  );
}