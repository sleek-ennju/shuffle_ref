import { useEffect, useReducer, useRef } from 'react';
import { initialState, matchReducer } from './matchEngine';
import type { MatchEvent } from './matchEngine';

import SetupScreen from './components/SetupScreen';
import MatchHeader from './components/MatchHeader';
import MatchControls from './components/MatchControls';
import ScoreControls from './components/ScoreControls';
import QueuePanel from './components/QueuePanel';
import AddTeamForm from './components/AddTeamForm';
import NextPreview from './components/NextPreview';
import RemoveTeamControl from './components/RemoveTeamControl';

export default function App() {
  const [state, dispatch] = useReducer(matchReducer, initialState);
  const whistleRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const prevRef = useRef<{
    championId: string | null;
    challengerId: string | null;
    status: string;
  } | null>(null);

  // Timer effect
  useEffect(() => {
    if (state.status !== 'running') return;

    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', payload: { seconds: 1 } });
    }, 1000);

    return () => window.clearInterval(id);
  }, [state.status]);

  // Whistle related logic
  const playWhistle = async () => {
    const a = whistleRef.current;
    if (!a) return;

    try {
      a.currentTime = 0;
      await a.play();
    } catch {
      // Most likely autoplay restriction. It will work after user interaction.
    }
  };

  useEffect(() => {
    const prev = prevRef.current;

    const current = {
      championId: state.championId,
      challengerId: state.challengerId,
      status: state.status,
    };

    if (prev) {
      const matchChanged =
        prev.championId !== current.championId ||
        prev.challengerId !== current.challengerId;

      const wasActive = prev.status === 'running' || prev.status === 'paused';

      if (matchChanged && wasActive) {
        playWhistle();
      }
    }

    prevRef.current = current;
  }, [state.championId, state.challengerId, state.status]);

  useEffect(() => {
    whistleRef.current = new Audio('/whistle.mp3');
    whistleRef.current.preload = 'auto';
  }, []);

  const unlockAudioOnce = async () => {
    if (audioUnlockedRef.current) return;

    const a = whistleRef.current;
    if (!a) return;

    try {
      a.volume = 0;          // silent
      await a.play();        // allowed because Start button is a user gesture
      a.pause();
      a.currentTime = 0;
      a.volume = 1;
      audioUnlockedRef.current = true;
    } catch {
      // If it fails, it just means the browser still blocked it. No crash.
    }
  };

  const dispatchWithFx = (event: MatchEvent) => {
  if (event.type === 'START_MATCH') {
    unlockAudioOnce();
  }
  dispatch(event);
};

  const sessionStarted = state.teams.length > 0;

  if (!sessionStarted) {
    return <SetupScreen dispatch={dispatch} />;
  }

  return (
  <div className="container">
    <MatchHeader state={state} />
    <ScoreControls state={state} dispatch={dispatchWithFx} />
    <AddTeamForm dispatch={dispatchWithFx} />
    <RemoveTeamControl state={state} dispatch={dispatchWithFx} />
    <NextPreview state={state} />
    <QueuePanel state={state} />

    <MatchControls state={state} dispatch={dispatchWithFx} />
  </div>
);
}