// App.tsx
import { useEffect, useMemo, useReducer } from "react";
import { initialState, matchReducer } from "./matchEngine";
import type { MatchState } from "./matchEngine";

function teamNameById(state: MatchState, teamId: string | null) {
  if (!teamId) return "—";
  return state.teams.find((t) => t.id === teamId)?.name ?? teamId;
}

export default function App() {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  // ✅ Sanity test: initialize once on mount (you can comment this out later)
  useEffect(() => {
    dispatch({
      type: "INIT_SESSION",
      payload: { teamCount: 5 },
    });
  }, []);

  // ✅ Log every state change so you can verify champion/challenger/queues quickly
  useEffect(() => {
    console.log("STATE UPDATE:", state);
  }, [state]);

  const championName = useMemo(
    () => teamNameById(state, state.championId),
    [state]
  );
  const challengerName = useMemo(
    () => teamNameById(state, state.challengerId),
    [state]
  );

  const mainQueueNames = useMemo(() => {
    return state.mainQueue.map((id) => teamNameById(state, id));
  }, [state]);

  const cooldownNames = useMemo(() => {
    return state.cooldownQueue.map((id) => teamNameById(state, id));
  }, [state]);

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Football Center Ref App (Sanity Test)</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <button
          onClick={() =>
            dispatch({
              type: "INIT_SESSION",
              payload: { teamCount: 5 },
            })
          }
        >
          Init (5 teams)
        </button>

        <button
          onClick={() =>
            dispatch({
              type: "INIT_SESSION",
              payload: { teamCount: 8 },
            })
          }
        >
          Init (8 teams)
        </button>

        <button
          onClick={() =>
            dispatch({
              type: "ADD_TEAM",
              payload: { name: "NEW" }, // optional; your engine may ignore or use it
            })
          }
        >
          Add Team
        </button>

        <button onClick={() => dispatch({ type: "START_MATCH" })}>
          Start Match
        </button>

        <button onClick={() => dispatch({ type: "PAUSE_MATCH" })}>
          Pause
        </button>

        <button onClick={() => dispatch({ type: "RESUME_MATCH" })}>
          Resume
        </button>

        <button onClick={() => dispatch({ type: "GOAL_CHAMPION" })}>
          Goal Champion
        </button>

        <button onClick={() => dispatch({ type: "GOAL_CHALLENGER" })}>
          Goal Challenger
        </button>

        <button
          onClick={() =>
            dispatch({
              type: "END_MATCH",
              payload: { reason: "refStop" },
            })
          }
        >
          End Match (refStop)
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Current Match</h2>
        <p style={{ margin: 0 }}>
          <strong>{championName}</strong> vs <strong>{challengerName}</strong>
        </p>
        <p style={{ margin: "8px 0 0" }}>
          Score: {state.goalsChampion} - {state.goalsChallenger}
        </p>
        <p style={{ margin: "8px 0 0" }}>
          Planned duration: <strong>{state.durationPlanned}</strong> minutes
        </p>
        <p style={{ margin: "8px 0 0" }}>
          Status: <strong>{state.status}</strong> | First match:{" "}
          <strong>{String(state.isFirstMatch)}</strong>
        </p>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Queues</h2>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Main Queue</div>
          {mainQueueNames.length === 0 ? (
            <div>—</div>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {mainQueueNames.map((name, idx) => (
                <span
                  key={`${name}-${idx}`}
                  style={{
                    padding: "4px 8px",
                    border: "1px solid #ccc",
                    borderRadius: 999,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Cooldown Queue</div>
          {cooldownNames.length === 0 ? (
            <div>—</div>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {cooldownNames.map((name, idx) => (
                <span
                  key={`${name}-${idx}`}
                  style={{
                    padding: "4px 8px",
                    border: "1px solid #ccc",
                    borderRadius: 999,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Raw State</h2>
        <pre style={{ margin: 0, overflow: "auto" }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
}