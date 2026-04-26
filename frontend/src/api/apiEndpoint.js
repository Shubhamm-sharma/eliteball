export const LOGIN_USER = "/api/user/loginuser";
export const SIGN_UP_USER = "/api/user/signupuser";

export const ADMIN_LOGIN = "/api/admin/login";
export const MATCHES = "/api/matches";
export const TEAMS = "/api/teams";
export const matchById = (matchId) => `/api/matches/${matchId}`;
export const matchLiveState = (matchId) =>
  `/api/matches/${matchId}/events/live-state`;
