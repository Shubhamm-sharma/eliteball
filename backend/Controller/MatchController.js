const Match = require("../Models/MatchSchema");
const mongoose = require("mongoose");

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildLiveStateFromTeams = (teams, existingLiveState = {}) => ({
  minute: toNumber(existingLiveState.minute, 0),
  period: existingLiveState.period || "not_started",
  homeScore: toNumber(existingLiveState.homeScore, teams[0]?.score || 0),
  awayScore: toNumber(existingLiveState.awayScore, teams[1]?.score || 0),
  homeFouls: toNumber(existingLiveState.homeFouls, 0),
  awayFouls: toNumber(existingLiveState.awayFouls, 0),
  homeYellowCards: toNumber(existingLiveState.homeYellowCards, 0),
  awayYellowCards: toNumber(existingLiveState.awayYellowCards, 0),
  homeRedCards: toNumber(existingLiveState.homeRedCards, 0),
  awayRedCards: toNumber(existingLiveState.awayRedCards, 0),
});

const listMatches = async (req, res) => {
  try {
    const { status = "all", limit = 30, sort = "desc" } = req.query;
    const query = status !== "all" ? { status } : {};
    const parsedLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
    const sortOrder = sort === "asc" ? 1 : -1;

    const matches = await Match.find(query)
      .populate("teams.teamId", "name logo")
      .sort({ startTime: sortOrder, createdAt: -1 })
      .limit(parsedLimit)
      .lean();

    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("teams.teamId", "name logo")
      .lean();

    if (!match) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    res.json({ success: true, data: match });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createMatch = async (req, res) => {
  try {
    const incomingTeams = Array.isArray(req.body?.teams) ? req.body.teams : [];

    if (incomingTeams.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "A match must contain exactly two teams",
      });
    }

    const normalizedTeams = incomingTeams.map((team) => ({
      teamId: team.teamId,
      score: toNumber(team.score, 0),
    }));

    if (String(normalizedTeams[0].teamId) === String(normalizedTeams[1].teamId)) {
      return res.status(400).json({
        success: false,
        message: "Home and away teams must be different",
      });
    }

    const tournamentId =
      req.body?.tournamentId || new mongoose.Types.ObjectId().toString();

    const match = new Match({
      ...req.body,
      tournamentId,
      teams: normalizedTeams,
      liveState: buildLiveStateFromTeams(normalizedTeams, req.body?.liveState),
    });
    await match.save();
    const createdMatch = await Match.findById(match._id)
      .populate("teams.teamId", "name logo")
      .lean();

    res.status(201).json({ success: true, data: createdMatch });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  listMatches,
  getMatchById,
  createMatch,
};
