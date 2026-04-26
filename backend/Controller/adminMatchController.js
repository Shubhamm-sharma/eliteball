// controllers/adminMatchController.js
const liveMatchService = require("../Services/liveMatch.service");

exports.addMatchEvent = async (req, res) => {
  try {
    const { id: matchId } = req.params;
    const result = await liveMatchService.addEvent(matchId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};

exports.getLiveState = async (req, res) => {
  try {
    const { id: matchId } = req.params;
    const state = await liveMatchService.getMatchLiveState(matchId);
    res.json({ success: true, data: state });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.updateScore = async (req, res) => {
  try {
    const { id: matchId } = req.params;
    const { teamId, score } = req.body;
    const result = await liveMatchService.updateScore(matchId, teamId, score);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};

exports.updateLiveState = async (req, res) => {
  try {
    const { id: matchId } = req.params;
    const state = await liveMatchService.updateLiveState(matchId, req.body);
    res.json({ success: true, data: state });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};
