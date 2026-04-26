const mongoose = require("mongoose");

const teamStatsSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    index: true,
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    index: true,
  },
  season: String,

  position: Number,
  points: Number,
  wins: Number,
  losses: Number,
  draws: Number,
  goalsFor: Number,
  goalsAgainst: Number,
});

module.exports = mongoose.model("TeamStats", teamStatsSchema);
