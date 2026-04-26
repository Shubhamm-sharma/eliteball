"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AdminDashboard.module.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const DEFAULT_ADMIN_EMAIL = "admin@insport.local";
const DEFAULT_ADMIN_PASSWORD = "admin12345";

const STATUS_FILTERS = [
  { value: "all", label: "All Matches" },
  { value: "live", label: "Live" },
  { value: "scheduled", label: "Scheduled" },
  { value: "finished", label: "Finished" },
];

const MATCH_STATUSES = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "finished", label: "Finished" },
  { value: "postponed", label: "Postponed" },
  { value: "cancelled", label: "Cancelled" },
];

const PERIODS = [
  { value: "not_started", label: "Not Started" },
  { value: "first_half", label: "First Half" },
  { value: "half_time", label: "Half Time" },
  { value: "second_half", label: "Second Half" },
  { value: "extra_time", label: "Extra Time" },
  { value: "penalties", label: "Penalties" },
  { value: "full_time", label: "Full Time" },
];

const EVENT_TYPES = [
  { value: "goal", label: "Goal" },
  { value: "yellow_card", label: "Yellow Card" },
  { value: "red_card", label: "Red Card" },
  { value: "substitution", label: "Substitution" },
  { value: "foul", label: "Foul" },
  { value: "penalty", label: "Penalty" },
  { value: "var_review", label: "VAR Review" },
];

const EVENT_LABELS = EVENT_TYPES.reduce((map, item) => {
  map[item.value] = item.label;
  return map;
}, {});

const EMPTY_LIVE_STATE = {
  minute: "0",
  period: "not_started",
  homeScore: "0",
  awayScore: "0",
  homeFouls: "0",
  awayFouls: "0",
  homeYellowCards: "0",
  awayYellowCards: "0",
  homeRedCards: "0",
  awayRedCards: "0",
  status: "scheduled",
};

const EMPTY_EVENT_FORM = {
  type: "goal",
  minute: "0",
  extraTime: "0",
  teamId: "",
  playerName: "",
  assistedByName: "",
  substitutedForName: "",
  description: "",
};

const EMPTY_TEAM_FORM = {
  name: "",
  logo: "",
};

const EMPTY_MATCH_FORM = {
  homeTeamId: "",
  awayTeamId: "",
  venue: "",
  round: "",
  startTime: "",
  status: "scheduled",
};

const toInputValue = (value, fallback = "0") => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return String(value);
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const cleanText = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const getTeamId = (team) => team?._id || team?.teamId?._id || team?.teamId || "";

const getTeamName = (team, fallback) => team?.name || team?.teamId?.name || fallback;

const formatKickoff = (value) => {
  if (!value) return "Kickoff TBD";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatMinute = (minute, extraTime = 0) =>
  Number(extraTime) > 0 ? `${minute}+${extraTime}'` : `${minute}'`;

const formatStatus = (value = "") =>
  value.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());

const buildEventSummary = (event) => {
  const parts = [];

  if (event.playerName) {
    parts.push(event.playerName);
  }

  if (event.assistedByName) {
    parts.push(`Assist: ${event.assistedByName}`);
  }

  if (event.substitutedForName) {
    parts.push(`Off: ${event.substitutedForName}`);
  }

  if (event.description) {
    parts.push(event.description);
  }

  return parts.join(" • ") || "Live event registered";
};

const getStatusMessageClass = (type) => {
  if (type === "error") return styles.messageError;
  if (type === "success") return styles.messageSuccess;
  return styles.messageInfo;
};

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: DEFAULT_ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
  });
  const [matchFilter, setMatchFilter] = useState("all");
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [manualMatchId, setManualMatchId] = useState("");
  const [matchState, setMatchState] = useState(null);
  const [liveStateForm, setLiveStateForm] = useState(EMPTY_LIVE_STATE);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [teamForm, setTeamForm] = useState(EMPTY_TEAM_FORM);
  const [matchSetupForm, setMatchSetupForm] = useState(EMPTY_MATCH_FORM);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [refreshingMatch, setRefreshingMatch] = useState(false);
  const [actionName, setActionName] = useState("");
  const [message, setMessage] = useState(null);
  const [matchesError, setMatchesError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  const activeMatch = matchState?.match || null;
  const homeTeam = activeMatch?.teams?.[0];
  const awayTeam = activeMatch?.teams?.[1];
  const recentEvents = useMemo(
    () => [...(matchState?.events || [])].reverse(),
    [matchState],
  );

  const requestJson = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const rawBody = await response.text();
    let payload = {};

    if (rawBody) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        throw new Error(rawBody);
      }
    }

    if (!response.ok || payload.success === false) {
      throw new Error(
        payload.message || `Request failed with status ${response.status}`,
      );
    }

    return payload;
  };

  const runAdminRequest = async (path, method, body) => {
    if (!token.trim()) {
      throw new Error("Log in as admin before sending write requests.");
    }

    return requestJson(path, {
      method,
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
      body: JSON.stringify(body),
    });
  };

  const hydrateMatchState = (state) => {
    setMatchState(state);
    setLastSyncedAt(new Date().toLocaleTimeString("en-IN"));

    const nextLiveState = state?.match?.liveState || {};
    const nextStatus = state?.match?.status || "scheduled";
    const nextTeams = state?.match?.teams || [];
    const fallbackTeamId = getTeamId(nextTeams[0]);

    setLiveStateForm({
      minute: toInputValue(nextLiveState.minute),
      period: nextLiveState.period || "not_started",
      homeScore: toInputValue(nextLiveState.homeScore),
      awayScore: toInputValue(nextLiveState.awayScore),
      homeFouls: toInputValue(nextLiveState.homeFouls),
      awayFouls: toInputValue(nextLiveState.awayFouls),
      homeYellowCards: toInputValue(nextLiveState.homeYellowCards),
      awayYellowCards: toInputValue(nextLiveState.awayYellowCards),
      homeRedCards: toInputValue(nextLiveState.homeRedCards),
      awayRedCards: toInputValue(nextLiveState.awayRedCards),
      status: nextStatus,
    });

    setEventForm((current) => {
      const teamIds = nextTeams.map(getTeamId).filter(Boolean);
      return {
        ...current,
        teamId: teamIds.includes(current.teamId)
          ? current.teamId
          : fallbackTeamId || "",
      };
    });
  };

  const loadTeams = async () => {
    try {
      setTeamsLoading(true);
      const payload = await requestJson("/api/teams");
      const nextTeams = payload.data || [];

      setTeams(nextTeams);
      setMatchSetupForm((current) => {
        const homeTeamId =
          current.homeTeamId && nextTeams.some((team) => team._id === current.homeTeamId)
            ? current.homeTeamId
            : nextTeams[0]?._id || "";
        const awayTeamId =
          current.awayTeamId && nextTeams.some((team) => team._id === current.awayTeamId)
            ? current.awayTeamId
            : nextTeams[1]?._id || "";

        return {
          ...current,
          homeTeamId,
          awayTeamId,
        };
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setTeamsLoading(false);
    }
  };

  const loadMatches = async (status = matchFilter, preserveSelection = true) => {
    try {
      setMatchesLoading(true);
      setMatchesError("");

      const params = new URLSearchParams({
        status,
        limit: "40",
      });
      const payload = await requestJson(`/api/matches?${params.toString()}`);
      const nextMatches = payload.data || [];

      setMatches(nextMatches);

      if (!nextMatches.length) {
        setSelectedMatchId("");
        setMatchState(null);
        return;
      }

      const preferredMatch =
        nextMatches.find((item) => item._id === selectedMatchId) ||
        nextMatches.find((item) => item.status === "live") ||
        nextMatches[0];

      if (!preserveSelection || !selectedMatchId || !preferredMatch) {
        setSelectedMatchId(preferredMatch?._id || "");
        setManualMatchId(preferredMatch?._id || "");
        return;
      }

      if (!nextMatches.some((item) => item._id === selectedMatchId)) {
        setSelectedMatchId(preferredMatch._id);
        setManualMatchId(preferredMatch._id);
      }
    } catch (error) {
      setMatchesError(error.message);
    } finally {
      setMatchesLoading(false);
    }
  };

  const loadLiveState = async (matchId, { silent = false } = {}) => {
    if (!matchId) return;

    try {
      setRefreshingMatch(true);
      const payload = await requestJson(`/api/matches/${matchId}/events/live-state`);
      hydrateMatchState(payload.data);

      if (!silent) {
        setMessage({
          type: "info",
          text: "Live state loaded from the backend service and cache layer.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setRefreshingMatch(false);
    }
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("insport-admin-token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("insport-admin-token", token);
      return;
    }

    window.localStorage.removeItem("insport-admin-token");
  }, [token]);

  useEffect(() => {
    void loadTeams();
  }, []);

  useEffect(() => {
    void loadMatches(matchFilter, true);
  }, [matchFilter]);

  useEffect(() => {
    if (!selectedMatchId) return;

    void loadLiveState(selectedMatchId);

    const intervalId = window.setInterval(() => {
      void loadLiveState(selectedMatchId, { silent: true });
    }, 25000);

    return () => window.clearInterval(intervalId);
  }, [selectedMatchId]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setActionName("login");
      const payload = await requestJson("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });

      setToken(payload.data.token);
      setMessage({
        type: "success",
        text: `Logged in as ${payload.data.user.email}. Admin writes are now enabled.`,
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setActionName("");
    }
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();

    try {
      setActionName("team");
      const payload = await runAdminRequest("/api/teams", "POST", {
        name: cleanText(teamForm.name),
        logo: cleanText(teamForm.logo),
      });

      const createdTeam = payload.data;
      await loadTeams();
      setTeamForm(EMPTY_TEAM_FORM);
      setMatchSetupForm((current) => ({
        ...current,
        homeTeamId: current.homeTeamId || createdTeam._id,
      }));
      setMessage({
        type: "success",
        text: `${createdTeam.name} has been stored in MongoDB.`,
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setActionName("");
    }
  };

  const handleCreateMatch = async (event) => {
    event.preventDefault();

    if (!matchSetupForm.homeTeamId || !matchSetupForm.awayTeamId) {
      setMessage({
        type: "error",
        text: "Choose both home and away teams before creating a match.",
      });
      return;
    }

    if (matchSetupForm.homeTeamId === matchSetupForm.awayTeamId) {
      setMessage({
        type: "error",
        text: "Home and away teams must be different.",
      });
      return;
    }

    try {
      setActionName("match-create");
      const payload = await runAdminRequest("/api/matches", "POST", {
        teams: [
          { teamId: matchSetupForm.homeTeamId, score: 0 },
          { teamId: matchSetupForm.awayTeamId, score: 0 },
        ],
        venue: cleanText(matchSetupForm.venue),
        round: cleanText(matchSetupForm.round),
        status: matchSetupForm.status,
        startTime: matchSetupForm.startTime
          ? new Date(matchSetupForm.startTime).toISOString()
          : new Date().toISOString(),
      });

      const createdMatch = payload.data;
      setSelectedMatchId(createdMatch._id);
      setManualMatchId(createdMatch._id);
      await loadMatches(matchFilter, false);
      await loadLiveState(createdMatch._id, { silent: true });
      setMessage({
        type: "success",
        text: "Match created and ready for live scoring updates.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setActionName("");
    }
  };

  const handleManualMatchLoad = async (event) => {
    event.preventDefault();

    if (!manualMatchId.trim()) {
      setMessage({ type: "error", text: "Enter a match id to load it manually." });
      return;
    }

    const nextMatchId = manualMatchId.trim();
    setSelectedMatchId(nextMatchId);
    await loadLiveState(nextMatchId);
  };

  const handleLiveStateSubmit = async (event) => {
    event.preventDefault();

    if (!selectedMatchId) {
      setMessage({
        type: "error",
        text: "Choose a match before updating live state.",
      });
      return;
    }

    try {
      setActionName("live-state");
      const payload = await runAdminRequest(
        `/api/matches/${selectedMatchId}/events/live-state`,
        "PATCH",
        {
          minute: toNumber(liveStateForm.minute),
          period: liveStateForm.period,
          homeScore: toNumber(liveStateForm.homeScore),
          awayScore: toNumber(liveStateForm.awayScore),
          homeFouls: toNumber(liveStateForm.homeFouls),
          awayFouls: toNumber(liveStateForm.awayFouls),
          homeYellowCards: toNumber(liveStateForm.homeYellowCards),
          awayYellowCards: toNumber(liveStateForm.awayYellowCards),
          homeRedCards: toNumber(liveStateForm.homeRedCards),
          awayRedCards: toNumber(liveStateForm.awayRedCards),
          status: liveStateForm.status,
        },
      );

      hydrateMatchState(payload.data);
      await loadMatches(matchFilter, true);
      setMessage({
        type: "success",
        text: "Match clock, status, cards, and fouls were saved to the database.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setActionName("");
    }
  };

  const handleScoreSubmit = async (event) => {
    event.preventDefault();

    if (!selectedMatchId || !homeTeam || !awayTeam) {
      setMessage({
        type: "error",
        text: "This match does not have two registered teams to score.",
      });
      return;
    }

    try {
      setActionName("score");

      await Promise.all([
        runAdminRequest(`/api/matches/${selectedMatchId}/events/score`, "PATCH", {
          teamId: getTeamId(homeTeam),
          score: toNumber(liveStateForm.homeScore),
        }),
        runAdminRequest(`/api/matches/${selectedMatchId}/events/score`, "PATCH", {
          teamId: getTeamId(awayTeam),
          score: toNumber(liveStateForm.awayScore),
        }),
      ]);

      await loadLiveState(selectedMatchId, { silent: true });
      await loadMatches(matchFilter, true);
      setMessage({
        type: "success",
        text: "Direct score update stored successfully.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setActionName("");
    }
  };

  const handleEventSubmit = async (event) => {
    event.preventDefault();

    if (!selectedMatchId) {
      setMessage({
        type: "error",
        text: "Select a match before logging an event.",
      });
      return;
    }

    if (!eventForm.teamId) {
      setMessage({
        type: "error",
        text: "Choose the team responsible for this event.",
      });
      return;
    }

    try {
      setActionName("event");

      const payload = await runAdminRequest(
        `/api/matches/${selectedMatchId}/events`,
        "POST",
        {
          type: eventForm.type,
          minute: toNumber(eventForm.minute),
          extraTime: toNumber(eventForm.extraTime),
          teamId: eventForm.teamId,
          playerName: cleanText(eventForm.playerName),
          assistedByName:
            eventForm.type === "goal"
              ? cleanText(eventForm.assistedByName)
              : undefined,
          substitutedForName:
            eventForm.type === "substitution"
              ? cleanText(eventForm.substitutedForName)
              : undefined,
          description: cleanText(eventForm.description),
        },
      );

      hydrateMatchState(payload.data.match);
      await loadMatches(matchFilter, true);
      setEventForm((current) => ({
        ...current,
        playerName: "",
        assistedByName: "",
        substitutedForName: "",
        description: "",
      }));
      setMessage({
        type: "success",
        text: `${EVENT_LABELS[eventForm.type]} logged and stored successfully.`,
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setActionName("");
    }
  };

  const setupNeedsAttention = !teams.length || !matches.length;
  const matchSummary = [
    {
      label: "Minute",
      value: liveStateForm.minute,
    },
    {
      label: "Period",
      value: formatStatus(liveStateForm.period),
    },
    {
      label: "Cards",
      value: `${liveStateForm.homeYellowCards}/${liveStateForm.awayYellowCards}`,
    },
    {
      label: "Fouls",
      value: `${liveStateForm.homeFouls}/${liveStateForm.awayFouls}`,
    },
  ];

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>Insport Live Operations</span>
          <h1>Run the match day desk from one working admin console.</h1>
          <p>
            This panel now connects directly to your backend APIs, can create the
            missing setup data on an empty database, and then pushes live score
            changes, cards, fouls, and event timeline updates into MongoDB.
          </p>
        </div>

        <div className={styles.heroPanel}>
          <div className={styles.heroStat}>
            <span>API Base</span>
            <strong>{API_BASE_URL}</strong>
          </div>
          <div className={styles.heroStat}>
            <span>Admin Status</span>
            <strong>{token ? "Authenticated for write access" : "Login required"}</strong>
          </div>
          <div className={styles.heroStat}>
            <span>Setup State</span>
            <strong>
              {setupNeedsAttention
                ? "Teams or matches still need to be created"
                : "Ready for live updates"}
            </strong>
          </div>
          <div className={styles.heroStat}>
            <span>Last Sync</span>
            <strong>{lastSyncedAt || "Waiting for match load"}</strong>
          </div>
        </div>
      </section>

      <section className={styles.board}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.kicker}>Admin Access</span>
              <h2>Login and setup controls</h2>
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={handleLogin}>
            <div className={styles.metricGrid}>
              <label className={styles.field}>
                <span>Admin Email</span>
                <input
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  value={loginForm.email}
                />
              </label>

              <label className={styles.field}>
                <span>Admin Password</span>
                <input
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  type="password"
                  value={loginForm.password}
                />
              </label>
            </div>

            <p className={styles.helperText}>
              Local default login is prefilled so the panel works immediately on
              a fresh backend. Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and
              `JWT_SECRET` in backend env for production use.
            </p>

            <button
              className={styles.primaryButton}
              disabled={actionName === "login"}
              type="submit"
            >
              {actionName === "login" ? "Signing In..." : "Login To Admin API"}
            </button>
          </form>

          <div className={styles.panelHeader}>
            <div>
              <span className={styles.kicker}>Setup</span>
              <h2>Create teams and the first match</h2>
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={handleCreateTeam}>
            <div className={styles.metricGrid}>
              <label className={styles.field}>
                <span>Team Name</span>
                <input
                  onChange={(event) =>
                    setTeamForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Example: Arsenal"
                  value={teamForm.name}
                />
              </label>

              <label className={styles.field}>
                <span>Logo URL</span>
                <input
                  onChange={(event) =>
                    setTeamForm((current) => ({
                      ...current,
                      logo: event.target.value,
                    }))
                  }
                  placeholder="Optional team logo"
                  value={teamForm.logo}
                />
              </label>
            </div>

            <button
              className={styles.primaryButton}
              disabled={actionName === "team"}
              type="submit"
            >
              {actionName === "team" ? "Saving Team..." : "Create Team In DB"}
            </button>
          </form>

          <div className={styles.chipGrid}>
            {teamsLoading ? (
              <div className={styles.emptyState}>Loading teams...</div>
            ) : teams.length ? (
              teams.map((team) => (
                <div className={styles.chip} key={team._id}>
                  <strong>{team.name}</strong>
                  <span>{team.logo ? "Logo linked" : "No logo"}</span>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                No teams stored yet. Create two teams first.
              </div>
            )}
          </div>

          <form className={styles.formGrid} onSubmit={handleCreateMatch}>
            <div className={styles.metricGrid}>
              <label className={styles.field}>
                <span>Home Team</span>
                <select
                  onChange={(event) =>
                    setMatchSetupForm((current) => ({
                      ...current,
                      homeTeamId: event.target.value,
                    }))
                  }
                  value={matchSetupForm.homeTeamId}
                >
                  <option value="">Select team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Away Team</span>
                <select
                  onChange={(event) =>
                    setMatchSetupForm((current) => ({
                      ...current,
                      awayTeamId: event.target.value,
                    }))
                  }
                  value={matchSetupForm.awayTeamId}
                >
                  <option value="">Select team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.metricGrid}>
              <label className={styles.field}>
                <span>Venue</span>
                <input
                  onChange={(event) =>
                    setMatchSetupForm((current) => ({
                      ...current,
                      venue: event.target.value,
                    }))
                  }
                  placeholder="Main stadium"
                  value={matchSetupForm.venue}
                />
              </label>

              <label className={styles.field}>
                <span>Round</span>
                <input
                  onChange={(event) =>
                    setMatchSetupForm((current) => ({
                      ...current,
                      round: event.target.value,
                    }))
                  }
                  placeholder="League stage or round"
                  value={matchSetupForm.round}
                />
              </label>
            </div>

            <div className={styles.metricGrid}>
              <label className={styles.field}>
                <span>Kickoff</span>
                <input
                  onChange={(event) =>
                    setMatchSetupForm((current) => ({
                      ...current,
                      startTime: event.target.value,
                    }))
                  }
                  type="datetime-local"
                  value={matchSetupForm.startTime}
                />
              </label>

              <label className={styles.field}>
                <span>Initial Status</span>
                <select
                  onChange={(event) =>
                    setMatchSetupForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  value={matchSetupForm.status}
                >
                  {MATCH_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              className={styles.primaryButton}
              disabled={actionName === "match-create"}
              type="submit"
            >
              {actionName === "match-create"
                ? "Creating Match..."
                : "Create Match In DB"}
            </button>
          </form>
        </article>

        <article className={`${styles.panel} ${styles.featurePanel}`}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.kicker}>Live View</span>
              <h2>Scoreboard snapshot</h2>
            </div>
            <button
              className={styles.secondaryButton}
              onClick={() => void loadLiveState(selectedMatchId)}
              type="button"
            >
              {refreshingMatch ? "Refreshing..." : "Refresh State"}
            </button>
          </div>

          <div className={styles.scoreboard}>
            <div className={styles.teamBlock}>
              <span>Home</span>
              <strong>{getTeamName(homeTeam, "Home Team")}</strong>
            </div>
            <div className={styles.scoreBlock}>
              <span>Live Score</span>
              <h3>
                {liveStateForm.homeScore} : {liveStateForm.awayScore}
              </h3>
              <p>{activeMatch ? formatStatus(activeMatch.status) : "Waiting for match"}</p>
            </div>
            <div className={styles.teamBlock}>
              <span>Away</span>
              <strong>{getTeamName(awayTeam, "Away Team")}</strong>
            </div>
          </div>

          <div className={styles.summaryGrid}>
            {matchSummary.map((item) => (
              <div className={styles.summaryCard} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <p className={styles.helperText}>
            When you submit here, the panel is now calling your backend APIs and
            saving the result in MongoDB instead of only updating local form
            state.
          </p>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.kicker}>Control Booth</span>
              <h2>Choose a match to operate</h2>
            </div>
            <button
              className={styles.secondaryButton}
              onClick={() => void loadMatches(matchFilter, false)}
              type="button"
            >
              Refresh Matches
            </button>
          </div>

          <div className={styles.filters}>
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                className={
                  matchFilter === filter.value
                    ? styles.filterButtonActive
                    : styles.filterButton
                }
                onClick={() => setMatchFilter(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>

          <form className={styles.inlineForm} onSubmit={handleManualMatchLoad}>
            <label className={styles.field}>
              <span>Manual Match ID</span>
              <input
                onChange={(event) => setManualMatchId(event.target.value)}
                placeholder="Load a match id directly"
                value={manualMatchId}
              />
            </label>
            <button className={styles.primaryButton} type="submit">
              Load Match
            </button>
          </form>

          {matchesError ? <p className={styles.errorText}>{matchesError}</p> : null}

          <div className={styles.matchList}>
            {matchesLoading ? (
              <div className={styles.emptyState}>Loading available matches...</div>
            ) : matches.length ? (
              matches.map((match) => {
                const firstTeam = getTeamName(match.teams?.[0], "Home");
                const secondTeam = getTeamName(match.teams?.[1], "Away");
                const isSelected = selectedMatchId === match._id;

                return (
                  <button
                    key={match._id}
                    className={isSelected ? styles.matchCardActive : styles.matchCard}
                    onClick={() => {
                      setSelectedMatchId(match._id);
                      setManualMatchId(match._id);
                    }}
                    type="button"
                  >
                    <div className={styles.matchCardTop}>
                      <span>{formatStatus(match.status)}</span>
                      <span>{formatKickoff(match.startTime)}</span>
                    </div>
                    <strong>
                      {firstTeam} vs {secondTeam}
                    </strong>
                    <p>{match.venue || "Venue pending"}</p>
                  </button>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                No matches stored yet. Create one in the setup panel.
              </div>
            )}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.kicker}>Score Sync</span>
              <h2>Direct scoreboard overwrite</h2>
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={handleScoreSubmit}>
            <label className={styles.field}>
              <span>{getTeamName(homeTeam, "Home Team")} Score</span>
              <input
                min="0"
                onChange={(event) =>
                  setLiveStateForm((current) => ({
                    ...current,
                    homeScore: event.target.value,
                  }))
                }
                type="number"
                value={liveStateForm.homeScore}
              />
            </label>

            <label className={styles.field}>
              <span>{getTeamName(awayTeam, "Away Team")} Score</span>
              <input
                min="0"
                onChange={(event) =>
                  setLiveStateForm((current) => ({
                    ...current,
                    awayScore: event.target.value,
                  }))
                }
                type="number"
                value={liveStateForm.awayScore}
              />
            </label>

            <button
              className={styles.primaryButton}
              disabled={actionName === "score"}
              type="submit"
            >
              {actionName === "score" ? "Pushing Score..." : "Update Score API"}
            </button>
          </form>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.kicker}>State Console</span>
              <h2>Minute, period, cards, fouls, status</h2>
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={handleLiveStateSubmit}>
            <div className={styles.metricGrid}>
              <label className={styles.field}>
                <span>Minute</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setLiveStateForm((current) => ({
                      ...current,
                      minute: event.target.value,
                    }))
                  }
                  type="number"
                  value={liveStateForm.minute}
                />
              </label>

              <label className={styles.field}>
                <span>Period</span>
                <select
                  onChange={(event) =>
                    setLiveStateForm((current) => ({
                      ...current,
                      period: event.target.value,
                    }))
                  }
                  value={liveStateForm.period}
                >
                  {PERIODS.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>Match Status</span>
              <select
                onChange={(event) =>
                  setLiveStateForm((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                value={liveStateForm.status}
              >
                {MATCH_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.metricGrid}>
              <label className={styles.field}>
                <span>Home Fouls</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setLiveStateForm((current) => ({
                      ...current,
                      homeFouls: event.target.value,
                    }))
                  }
                  type="number"
                  value={liveStateForm.homeFouls}
                />
              </label>
              <label className={styles.field}>
                <span>Away Fouls</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setLiveStateForm((current) => ({
                      ...current,
                      awayFouls: event.target.value,
                    }))
                  }
                  type="number"
                  value={liveStateForm.awayFouls}
                />
              </label>
              <label className={styles.field}>
                <span>Home Yellow Cards</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setLiveStateForm((current) => ({
                      ...current,
                      homeYellowCards: event.target.value,
                    }))
                  }
                  type="number"
                  value={liveStateForm.homeYellowCards}
                />
              </label>
              <label className={styles.field}>
                <span>Away Yellow Cards</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setLiveStateForm((current) => ({
                      ...current,
                      awayYellowCards: event.target.value,
                    }))
                  }
                  type="number"
                  value={liveStateForm.awayYellowCards}
                />
              </label>
              <label className={styles.field}>
                <span>Home Red Cards</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setLiveStateForm((current) => ({
                      ...current,
                      homeRedCards: event.target.value,
                    }))
                  }
                  type="number"
                  value={liveStateForm.homeRedCards}
                />
              </label>
              <label className={styles.field}>
                <span>Away Red Cards</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setLiveStateForm((current) => ({
                      ...current,
                      awayRedCards: event.target.value,
                    }))
                  }
                  type="number"
                  value={liveStateForm.awayRedCards}
                />
              </label>
            </div>

            <button
              className={styles.primaryButton}
              disabled={actionName === "live-state"}
              type="submit"
            >
              {actionName === "live-state" ? "Syncing State..." : "Update Live State"}
            </button>
          </form>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.kicker}>Event Studio</span>
              <h2>Goals, cards, fouls, subs, assists</h2>
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={handleEventSubmit}>
            <div className={styles.metricGrid}>
              <label className={styles.field}>
                <span>Event Type</span>
                <select
                  onChange={(event) =>
                    setEventForm((current) => ({
                      ...current,
                      type: event.target.value,
                    }))
                  }
                  value={eventForm.type}
                >
                  {EVENT_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Team</span>
                <select
                  onChange={(event) =>
                    setEventForm((current) => ({
                      ...current,
                      teamId: event.target.value,
                    }))
                  }
                  value={eventForm.teamId}
                >
                  <option value="">Select team</option>
                  {[homeTeam, awayTeam].filter(Boolean).map((team, index) => (
                    <option key={getTeamId(team) || index} value={getTeamId(team)}>
                      {getTeamName(team, index === 0 ? "Home Team" : "Away Team")}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Minute</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setEventForm((current) => ({
                      ...current,
                      minute: event.target.value,
                    }))
                  }
                  type="number"
                  value={eventForm.minute}
                />
              </label>

              <label className={styles.field}>
                <span>Extra Time</span>
                <input
                  min="0"
                  onChange={(event) =>
                    setEventForm((current) => ({
                      ...current,
                      extraTime: event.target.value,
                    }))
                  }
                  type="number"
                  value={eventForm.extraTime}
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Player Name</span>
              <input
                onChange={(event) =>
                  setEventForm((current) => ({
                    ...current,
                    playerName: event.target.value,
                  }))
                }
                placeholder="Free-text player support until a player catalogue is added"
                value={eventForm.playerName}
              />
            </label>

            {eventForm.type === "goal" ? (
              <label className={styles.field}>
                <span>Assisted By</span>
                <input
                  onChange={(event) =>
                    setEventForm((current) => ({
                      ...current,
                      assistedByName: event.target.value,
                    }))
                  }
                  placeholder="Optional assister name"
                  value={eventForm.assistedByName}
                />
              </label>
            ) : null}

            {eventForm.type === "substitution" ? (
              <label className={styles.field}>
                <span>Substituted For</span>
                <input
                  onChange={(event) =>
                    setEventForm((current) => ({
                      ...current,
                      substitutedForName: event.target.value,
                    }))
                  }
                  placeholder="Player leaving the pitch"
                  value={eventForm.substitutedForName}
                />
              </label>
            ) : null}

            <label className={styles.field}>
              <span>Description</span>
              <textarea
                onChange={(event) =>
                  setEventForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Optional context: penalty won, VAR check, tactical note, etc."
                rows="4"
                value={eventForm.description}
              />
            </label>

            <button
              className={styles.primaryButton}
              disabled={actionName === "event"}
              type="submit"
            >
              {actionName === "event" ? "Sending Event..." : "Log Match Event"}
            </button>
          </form>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.kicker}>Event Feed</span>
              <h2>Recent match timeline</h2>
            </div>
          </div>

          {message ? (
            <div className={getStatusMessageClass(message.type)}>{message.text}</div>
          ) : null}

          <div className={styles.timeline}>
            {recentEvents.length ? (
              recentEvents.map((event) => (
                <article className={styles.timelineItem} key={event._id}>
                  <div className={styles.timelineMinute}>
                    {formatMinute(event.minute, event.extraTime)}
                  </div>
                  <div className={styles.timelineBody}>
                    <div className={styles.timelineTop}>
                      <strong>{EVENT_LABELS[event.type] || formatStatus(event.type)}</strong>
                      <span>{event.teamId?.name || "Team event"}</span>
                    </div>
                    <p>{buildEventSummary(event)}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className={styles.emptyState}>
                Once events are logged they will appear here instantly.
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
