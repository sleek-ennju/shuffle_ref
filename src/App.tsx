import { useEffect, useReducer } from 'react';
import { initialState, matchReducer } from './matchEngine';

import SetupScreen from './components/SetupScreen';
import MatchHeader from './components/MatchHeader';
import MatchControls from './components/MatchControls';
import ScoreControls from './components/ScoreControls';
import QueuePanel from './components/QueuePanel';

export default function App() {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  // Timer effect
  useEffect(() => {
    if (state.status !== 'running') return;

    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', payload: { seconds: 1 } });
    }, 1000);

    return () => window.clearInterval(id);
  }, [state.status]);

  const sessionStarted = state.teams.length > 0;

  if (!sessionStarted) {
    return <SetupScreen dispatch={dispatch} />;
  }

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <MatchHeader state={state} />

      <MatchControls state={state} dispatch={dispatch} />

      <ScoreControls state={state} dispatch={dispatch} />

      <QueuePanel state={state} />
    </div>
  );
}