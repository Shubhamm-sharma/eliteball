const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
      index: true,
    },

    teams: [
      {
        teamId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
          required: true,
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],

    status: {
      type: String,
      enum: ["scheduled", "live", "finished", "postponed", "cancelled"],
      default: "scheduled",
      index: true,
    },

    startTime: {
      type: Date,
      index: true,
    },

    endTime: Date,

    venue: String,
    round: String, // "Group A", "Quarterfinal", etc.

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    // Add inside matchSchema fields:
    liveState: {
      minute: { type: Number, default: 0 },
      period: {
        type: String,
        enum: [
          "not_started",
          "first_half",
          "half_time",
          "second_half",
          "extra_time",
          "penalties",
          "full_time",
        ],
        default: "not_started",
      },
      homeScore: { type: Number, default: 0 },
      awayScore: { type: Number, default: 0 },
      homeFouls: { type: Number, default: 0 },
      awayFouls: { type: Number, default: 0 },
      homeYellowCards: { type: Number, default: 0 },
      awayYellowCards: { type: Number, default: 0 },
      homeRedCards: { type: Number, default: 0 },
      awayRedCards: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

// compound index (VERY important)
matchSchema.index({ tournamentId: 1, startTime: 1 });
matchSchema.index({ "teams.teamId": 1 });

module.exports = mongoose.model("Match", matchSchema);
