import type { MatchState } from '../matchEngine';
import { teamNameById } from '../utils/teamNameById';
import { formatTime } from '../utils/formatTime';

type Props = { state: MatchState };

export default function MatchHeader({ state }: Props) {
  const championName = teamNameById(state, state.championId);
  const challengerName = teamNameById(state, state.challengerId);
  const showWarning = state.status === 'running' && state.secondsLeft <= 120;

  return (
    <div className="card">
      <div className="bigMatchRow">
        <div className="bigTeams">
          {championName} <span className="muted">vs</span> {challengerName}
        </div>
        <div className={`badge ${state.status}`}>{state.status.toUpperCase()}</div>
      </div>

      <div className={`bigTime ${showWarning ? 'danger' : ''}`}>
        {formatTime(state.secondsLeft)}
      </div>

      <div className="bigScore">
        <div className="scoreBox">
          <div className="scoreLabel">
            <span>{championName}</span>
            <span className="muted">Champion</span>
          </div>
          <div className="scoreValue">{state.goalsChampion}</div>
        </div>

        <div className="scoreBox">
          <div className="scoreLabel">
            <span>{challengerName}</span>
            <span className="muted">Challenger</span>
          </div>
          <div className="scoreValue">{state.goalsChallenger}</div>
        </div>
      </div>
    </div>
  );
}