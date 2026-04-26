const cache = require("./CacheService");
const Match = require("../Models/MatchSchema");
const MatchEvent = require("../Models/MatchEventSchema");
const { emitMatchUpdate } = require("./SocketService");

const LIVE_STATE_DEFAULTS = {
  minute: 0,
  period: "not_started",
  homeScore: 0,
  awayScore: 0,
  homeFouls: 0,
  awayFouls: 0,
  homeYellowCards: 0,
  awayYellowCards: 0,
  homeRedCards: 0,
  awayRedCards: 0,
};

const LIVE_STATE_KEYS = new Set(Object.keys(LIVE_STATE_DEFAULTS));
const PERIOD_VALUES = new Set([
  "not_started",
  "first_half",
  "half_time",
  "second_half",
  "extra_time",
  "penalties",
  "full_time",
]);
const STATUS_VALUES = new Set([
  "scheduled",
  "live",
  "finished",
  "postponed",
  "cancelled",
]);

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const trimOrUndefined = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const ensureLiveState = (match) => {
  if (!match.liveState) {
    match.liveState = { ...LIVE_STATE_DEFAULTS };
    return match.liveState;
  }

  Object.entries(LIVE_STATE_DEFAULTS).forEach(([key, defaultValue]) => {
    if (match.liveState[key] === undefined || match.liveState[key] === null) {
      match.liveState[key] = defaultValue;
    }
  });

  return match.liveState;
};

const findTeamIndex = (match, teamId) =>
  match.teams.findIndex(
    (team) => String(team.teamId?._id || team.teamId) === String(teamId),
  );

const getSidePrefix = (teamIndex) => {
  if (teamIndex === 0) return "home";
  if (teamIndex === 1) return "away";
  return null;
};

const syncScoresFromTeams = (match) => {
  const liveState = ensureLiveState(match);
  liveState.homeScore = toNumber(match.teams?.[0]?.score, 0);
  liveState.awayScore = toNumber(match.teams?.[1]?.score, 0);
};

const syncTeamsFromLiveState = (match) => {
  const liveState = ensureLiveState(match);

  if (match.teams?.[0]) {
    match.teams[0].score = toNumber(liveState.homeScore, match.teams[0].score);
  }

  if (match.teams?.[1]) {
    match.teams[1].score = toNumber(liveState.awayScore, match.teams[1].score);
  }
};

const syncMatchStatusFromPeriod = (match) => {
  const liveState = ensureLiveState(match);

  if (liveState.period === "full_time") {
    match.status = "finished";
    return;
  }

  if (liveState.period === "not_started" && match.status !== "finished") {
    match.status = "scheduled";
    return;
  }

  if (match.status === "scheduled") {
    match.status = "live";
  }
};

const loadMatch = async (matchId) => {
  const match = await Match.findById(matchId);

  if (!match) {
    const error = new Error("Match not found");
    error.status = 404;
    throw error;
  }

  return match;
};

const refreshLiveState = async (matchId, event = null) => {
  await cache.invalidateLiveState(matchId);
  const updatedState = await getMatchLiveState(matchId);
  emitMatchUpdate(matchId, event ? { event, match: updatedState } : { match: updatedState });
  return updatedState;
};

const applyEventImpact = (match, event, teamIndex) => {
  const liveState = ensureLiveState(match);
  const sidePrefix = getSidePrefix(teamIndex);

  if (!sidePrefix) return;

  liveState.minute = Math.max(
    toNumber(liveState.minute, 0),
    toNumber(event.minute, 0),
  );

  if (liveState.period === "not_started") {
    liveState.period = "first_half";
  }

  if (match.status === "scheduled") {
    match.status = "live";
  }

  switch (event.type) {
    case "goal":
      match.teams[teamIndex].score = toNumber(match.teams[teamIndex].score, 0) + 1;
      syncScoresFromTeams(match);
      break;
    case "foul":
      liveState[`${sidePrefix}Fouls`] =
        toNumber(liveState[`${sidePrefix}Fouls`], 0) + 1;
      break;
    case "yellow_card":
      liveState[`${sidePrefix}YellowCards`] =
        toNumber(liveState[`${sidePrefix}YellowCards`], 0) + 1;
      break;
    case "red_card":
      liveState[`${sidePrefix}RedCards`] =
        toNumber(liveState[`${sidePrefix}RedCards`], 0) + 1;
      break;
    default:
      break;
  }
};

// Cache-aside pattern for live match state
const getMatchLiveState = async (matchId) => {
  const cached = await cache.getLiveState(matchId);
  if (cached) return cached; // cache HIT → return instantly

  const [match, events] = await Promise.all([
    // cache MISS → query MongoDB
    Match.findById(matchId).populate("teams.teamId", "name logo").lean(),
    MatchEvent.find({ matchId })
      .populate("teamId", "name logo")
      .sort({ minute: 1, extraTime: 1, createdAt: 1 })
      .lean(),
  ]);

  if (!match) {
    const error = new Error("Match not found");
    error.status = 404;
    throw error;
  }

  const state = { match, events };
  await cache.setLiveState(matchId, state); // store in Redis for next request
  return state;
};

// Add a new match event
const addEvent = async (matchId, eventData) => {
  const match = await loadMatch(matchId);
  const teamIndex = findTeamIndex(match, eventData.teamId);

  if (teamIndex === -1) {
    const error = new Error("Match or team not found");
    error.status = 404;
    throw error;
  }

  const event = new MatchEvent({
    matchId,
    type: eventData.type,
    minute: toNumber(eventData.minute),
    extraTime: toNumber(eventData.extraTime),
    teamId: eventData.teamId,
    playerId: eventData.playerId || undefined,
    playerName: trimOrUndefined(eventData.playerName),
    assistedBy: eventData.assistedBy || undefined,
    assistedByName: trimOrUndefined(eventData.assistedByName),
    substitutedFor: eventData.substitutedFor || undefined,
    substitutedForName: trimOrUndefined(eventData.substitutedForName),
    description: trimOrUndefined(eventData.description),
  });

  await event.save();
  applyEventImpact(match, event, teamIndex);
  await match.save();

  // Invalidate cache and emit update
  const state = await handleEventUpdate(matchId, event);

  return { match: state, event };
};

const updateScore = async (matchId, teamId, score) => {
  const match = await loadMatch(matchId);
  const teamIndex = findTeamIndex(match, teamId);

  if (teamIndex === -1) {
    const error = new Error("Match or team not found");
    error.status = 404;
    throw error;
  }

  match.teams[teamIndex].score = toNumber(score, 0);
  syncScoresFromTeams(match);

  if (match.status === "scheduled") {
    match.status = "live";
  }

  await match.save();
  const state = await refreshLiveState(matchId);

  return { match, state };
};

const updateLiveState = async (matchId, updates = {}) => {
  const match = await loadMatch(matchId);
  const liveState = ensureLiveState(match);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || !LIVE_STATE_KEYS.has(key)) {
      return;
    }

    if (key === "period") {
      if (PERIOD_VALUES.has(value)) {
        liveState[key] = value;
      }
      return;
    }

    liveState[key] = toNumber(value, liveState[key]);
  });

  if (updates.status && STATUS_VALUES.has(updates.status)) {
    match.status = updates.status;
  } else {
    syncMatchStatusFromPeriod(match);
  }

  syncTeamsFromLiveState(match);
  await match.save();

  return refreshLiveState(matchId);
};

// Helper function to invalidate cache and emit updates after events
const handleEventUpdate = async (matchId, event) => {
  return refreshLiveState(matchId, event);
};

module.exports = {
  getMatchLiveState,
  handleEventUpdate,
  addEvent,
  updateScore,
  updateLiveState,
};
