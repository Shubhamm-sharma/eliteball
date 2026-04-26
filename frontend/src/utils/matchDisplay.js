export const getMatchTeams = (match) => {
  const home = match?.teams?.[0] || {};
  const away = match?.teams?.[1] || {};

  return {
    homeTeam: home.teamId || {},
    awayTeam: away.teamId || {},
    homeScore: match?.liveState?.homeScore ?? home.score ?? 0,
    awayScore: match?.liveState?.awayScore ?? away.score ?? 0,
  };
};

export const getTeamName = (team, fallback) => team?.name || fallback;

export const getShortName = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "TBD";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((word) => word[0]).join("").slice(0, 4).toUpperCase();
};

export const formatMatchTime = (startTime) => {
  if (!startTime) return "Time TBA";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(startTime));
};

export const formatLiveTime = (match) => {
  const period = match?.liveState?.period || match?.status || "scheduled";
  const minute = match?.liveState?.minute;

  if (period === "full_time" || match?.status === "finished") return "Full time";
  if (period === "not_started" || match?.status === "scheduled") {
    return formatMatchTime(match?.startTime);
  }
  if (Number.isFinite(Number(minute)) && Number(minute) > 0) {
    return `${minute}'`;
  }

  return period.replaceAll("_", " ");
};
