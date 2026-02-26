




// Types ad interfaces
export interface TeamState {
  id: string;
  name: string;
}

export type MatchStatus = "idle" | "running" | "paused" | "ended";

export type EndReason = "twoGoalLead" | "timer" | "refStop";

// 1. Initialize session
export type InitSessionEvent = {
  type: "INIT_SESSION";
  payload: {
    teamCount: number;
  };
};

// 2. Start match
export type StartMatchEvent = {
  type: "START_MATCH";
};

// 3. Pause match
export type PauseMatchEvent = {
  type: "PAUSE_MATCH";
};

// 4. Resume match
export type ResumeMatchEvent = {
  type: "RESUME_MATCH";
};

// 5. Champion scores
export type GoalChampionEvent = {
  type: "GOAL_CHAMPION";
};

// 6. Challenger scores
export type GoalChallengerEvent = {
  type: "GOAL_CHALLENGER";
};

// 7. End match manually or automatically
export type EndMatchEvent = {
  type: "END_MATCH";
  payload: {
    reason: EndReason;
  };
};

// 8. Add team mid-session
export type AddTeamEvent = {
  type: "ADD_TEAM";
  payload?: {
    name?: string;
  };
};

// 9. Remove team
export type RemoveTeamEvent = {
  type: "REMOVE_TEAM";
  payload: {
    teamId: string;
  };
};

// 10. Tick
export type TickEvent = {
  type: 'TICK';
  payload?: {
    seconds?: number; // default 1
  };
};

// Reset Team
export type ResetSessionEvent = {
  type: 'RESET_SESSION';
};

export interface MatchState {
  teams: TeamState[];

  championId: string | null;
  challengerId: string | null;

  goalsChampion: number;
  goalsChallenger: number;

  durationPlanned: number;
  secondsLeft: number;

  status: MatchStatus;

  mainQueue: string[];
  cooldownQueue: string[];

  isFirstMatch: boolean;
}

// Initial state
export const initialState: MatchState = {
  teams: [],
  championId: null,
  challengerId: null,
  goalsChampion: 0,
  goalsChallenger: 0,
  durationPlanned: 0,
  status: 'idle',
  mainQueue: [],
  cooldownQueue: [],
  isFirstMatch: true,
  secondsLeft : 0
};

// Helpers
const alphabetName = (index: number) => {
  // 0 => A, 1 => B ... 25 => Z, 26 => AA, etc (supports > 26 teams)
  let n = index;
  let name = "";
  while (n >= 0) {
    name = String.fromCharCode((n % 26) + 65) + name;
    n = Math.floor(n / 26) - 1;
  }
  return name;
};

const makeTeamId = (name: string) => `team_${name}`;

function pullNextTeam(
  mainQueue: string[],
  cooldownQueue: string[]
): { nextId: string | null; mainQueue: string[]; cooldownQueue: string[] } {
  if (mainQueue.length > 0) {
    const [nextId, ...rest] = mainQueue;
    return { nextId, mainQueue: rest, cooldownQueue };
  }

  if (cooldownQueue.length > 0) {
    // recycle cooldown -> main
    const recycledMain = [...cooldownQueue];
    const [nextId, ...rest] = recycledMain;
    return { nextId, mainQueue: rest, cooldownQueue: [] };
  }

  return { nextId: null, mainQueue, cooldownQueue };
}

function pullNextTwoTeams(
  mainQueue: string[],
  cooldownQueue: string[]
): {
  aId: string | null;
  bId: string | null;
  mainQueue: string[];
  cooldownQueue: string[];
} {
  // Ensure we have enough in main; if not, recycle cooldown into main
  let mq = [...mainQueue];
  let cq = [...cooldownQueue];

  if (mq.length < 2 && cq.length > 0) {
    mq = [...mq, ...cq];
    cq = [];
  }

  if (mq.length < 2) {
    return { aId: null, bId: null, mainQueue: mq, cooldownQueue: cq };
  }

  const aId = mq[0]!;
  const bId = mq[1]!;
  const rest = mq.slice(2);

  return { aId, bId, mainQueue: rest, cooldownQueue: cq };
}

function resolveMatchEnd(state: MatchState, reason: EndReason): MatchState {
  const champ = state.championId;
  const chall = state.challengerId;

  if (!champ || !chall) return state;

  const gc = state.goalsChampion;
  const gl = state.goalsChallenger;

  const isDraw = gc === gl;

  // After first match, all matches are 10 mins
  const durationPlanned = 10;

  // NOTE: We'll set isFirstMatch to false after resolving the first match
  const willBeFirstMatch = false;

  // CASE: DRAW -> both to cooldown, next two teams play
  if (isDraw) {
    const cooldownQueue = [...state.cooldownQueue, champ, chall];

    const { aId, bId, mainQueue, cooldownQueue: cq2 } = pullNextTwoTeams(
      state.mainQueue,
      cooldownQueue
    );

    console.log(reason);
    return {
      ...state,
      championId: aId,
      challengerId: bId,
      goalsChampion: 0,
      goalsChallenger: 0,
      durationPlanned,
      secondsLeft: durationPlanned * 60,
      status: 'idle',
      mainQueue,
      cooldownQueue: cq2,
      isFirstMatch: willBeFirstMatch,
    };
  }

  // CASE: WINNER exists
  const championWon = gc > gl;
  const winnerId = championWon ? champ : chall;
  const loserId = championWon ? chall : champ;

  // Loser -> cooldown first
  const cooldownQueue = [...state.cooldownQueue, loserId];

  // Winner stays as "champion"
  const { nextId, mainQueue, cooldownQueue: cq2 } = pullNextTeam(
    state.mainQueue,
    cooldownQueue
  );

  return {
    ...state,
    championId: winnerId,
    challengerId: nextId,
    goalsChampion: 0,
    goalsChallenger: 0,
    durationPlanned,
    secondsLeft: durationPlanned * 60,
    status: 'idle',
    mainQueue,
    cooldownQueue: cq2,
    isFirstMatch: willBeFirstMatch,
  };
}


// Reducer
export function matchReducer(state: MatchState, event: MatchEvent): MatchState {
  switch (event.type) {
    case "INIT_SESSION": {
      const count = event.payload.teamCount;

      // Guard: need at least 2 teams to start
      if (count < 2) {
        return {
          ...state,
          teams: [],
          championId: null,
          challengerId: null,
          goalsChampion: 0,
          goalsChallenger: 0,
          durationPlanned: 0,
          status: "idle",
          mainQueue: [],
          cooldownQueue: [],
          isFirstMatch: true,
          secondsLeft: 0,
        };
      }

      const teams = Array.from({ length: count }, (_, i) => {
        const name = alphabetName(i);
        return { id: makeTeamId(name), name };
      });

      const champion = teams[0]!.id;
      const challenger = teams[1]!.id;

      const mainQueue = teams.slice(2).map((t) => t.id);

      return {
        ...state,
        teams,
        championId: champion,
        challengerId: challenger,
        goalsChampion: 0,
        goalsChallenger: 0,
        durationPlanned: 15, // first match special rule
        secondsLeft: 15 * 60,
        status: "idle", // keep idle; UI can dispatch START_MATCH
        mainQueue,
        cooldownQueue: [],
        isFirstMatch: true,
      };
    }

    case 'START_MATCH': {
        // Need a valid match to start
        if (!state.championId || !state.challengerId) return state;

        // If already running, do nothing
        if (state.status === 'running') return state;

        const shouldReset = state.secondsLeft <= 0;
        const secondsLeft = shouldReset ? state.durationPlanned * 60 : state.secondsLeft;

        return {
            ...state,
            status: 'running',
            secondsLeft,
        };
    }

    case 'PAUSE_MATCH': {
        if (state.status !== 'running') return state;
        return { ...state, status: 'paused' };
    }

    case 'RESUME_MATCH': {
        if (state.status !== 'paused') return state;
        return { ...state, status: 'running' };
    }

    case 'TICK': {
        if (state.status !== 'running') return state;

        const dec = event.payload?.seconds ?? 1;
        const next = Math.max(0, state.secondsLeft - dec);

        // For THIS step, when it hits 0 we just end the match (rotation comes later)
        if (next === 0) {
            // set secondsLeft to 0 first (optional)
            const endedState = { ...state, secondsLeft: 0 };
            return resolveMatchEnd(endedState, 'timer');
        }

        return { ...state, secondsLeft: next };
    }

    case 'GOAL_CHAMPION': {
        // Only allow scoring during running/paused (your choice). I'll allow both.
        if (!state.championId || !state.challengerId) return state;
        if (state.status !== 'running' && state.status !== 'paused') return state;

        const goalsChampion = state.goalsChampion + 1;
        const goalsChallenger = state.goalsChallenger;

        // Auto-end if lead becomes 2+
        if (goalsChampion - goalsChallenger >= 2) {
            const updated = { ...state, goalsChampion };
            return resolveMatchEnd(updated, 'twoGoalLead');
        }

        return { ...state, goalsChampion };
    }

    case 'GOAL_CHALLENGER': {
        if (!state.championId || !state.challengerId) return state;
        if (state.status !== 'running' && state.status !== 'paused') return state;

        const goalsChampion = state.goalsChampion;
        const goalsChallenger = state.goalsChallenger + 1;

        if (goalsChallenger - goalsChampion >= 2) {
            const updated = { ...state, goalsChallenger };
            return resolveMatchEnd(updated, 'twoGoalLead');
        }

  return { ...state, goalsChallenger };
    }

    case 'END_MATCH': {
      return resolveMatchEnd(state, event.payload.reason);
    }

    case 'ADD_TEAM': {
      if (state.teams.length === 0) return state;

      const rawName = event.payload?.name?.trim();
      const name = rawName && rawName.length > 0 ? rawName : alphabetName(state.teams.length);

      const id = makeTeamId(name);

      // If ID already exists (e.g. someone adds "A"), make it unique
      const exists = state.teams.some((t) => t.id === id);
      const finalId = exists ? `${id}_${Date.now()}` : id;

      const newTeam = { id: finalId, name };

      return {
        ...state,
        teams: [...state.teams, newTeam],
        mainQueue: [...state.mainQueue, finalId], // ✅ back of the queue
      };
    }

    case 'RESET_SESSION': {
      return initialState;
    }

    case 'REMOVE_TEAM': {
      const removeId = event.payload.teamId;

      // Remove from teams + queues
      const teams = state.teams.filter((t) => t.id !== removeId);
      let mainQueue = state.mainQueue.filter((id) => id !== removeId);
      let cooldownQueue = state.cooldownQueue.filter((id) => id !== removeId);

      const removingChampion = state.championId === removeId;
      const removingChallenger = state.challengerId === removeId;

      // If the removed team is not currently playing, just update lists
      if (!removingChampion && !removingChallenger) {
        return { ...state, teams, mainQueue, cooldownQueue };
      }

      // If fewer than 2 teams remain, clear match safely
      if (teams.length < 2) {
        return {
          ...state,
          teams,
          mainQueue,
          cooldownQueue,
          championId: null,
          challengerId: null,
          goalsChampion: 0,
          goalsChallenger: 0,
          durationPlanned: 0,
          secondsLeft: 0,
          status: 'idle',
        };
      }

      // ✅ Keep the remaining on-pitch team
      const remainingId =
        removingChampion ? state.challengerId : state.championId;

      // Remaining should exist (unless both were somehow the same, which shouldn't happen)
      if (!remainingId || remainingId === removeId) {
        // Fallback: pick next two from queues
        const rebuilt = {
          ...state,
          teams,
          mainQueue,
          cooldownQueue,
          championId: null,
          challengerId: null,
          goalsChampion: 0,
          goalsChallenger: 0,
          status: 'idle' as const,
        };

        const { aId, bId, mainQueue: mq2, cooldownQueue: cq2 } = pullNextTwoTeams(
          rebuilt.mainQueue,
          rebuilt.cooldownQueue
        );

        const durationPlanned = rebuilt.isFirstMatch ? 15 : 10;

        return {
          ...rebuilt,
          championId: aId,
          challengerId: bId,
          durationPlanned,
          secondsLeft: durationPlanned * 60,
          mainQueue: mq2,
          cooldownQueue: cq2,
        };
      }

      // ✅ Pick next opponent from mainQueue first, else recycle cooldown
      const pulled = pullNextTeam(mainQueue, cooldownQueue);
      mainQueue = pulled.mainQueue;
      cooldownQueue = pulled.cooldownQueue;

      const durationPlanned = state.isFirstMatch ? 15 : 10;

      return {
        ...state,
        teams,
        mainQueue,
        cooldownQueue,
        championId: remainingId,          // remaining team stays
        challengerId: pulled.nextId,      // next opponent
        goalsChampion: 0,
        goalsChallenger: 0,
        durationPlanned,
        secondsLeft: durationPlanned * 60,
        status: 'idle',
      };
    }

    default:
      return state;
  }
}

export type MatchEvent =
  | InitSessionEvent
  | StartMatchEvent
  | PauseMatchEvent
  | ResumeMatchEvent
  | GoalChampionEvent
  | GoalChallengerEvent
  | EndMatchEvent
  | AddTeamEvent
  | RemoveTeamEvent
  | TickEvent
  | ResetSessionEvent;
