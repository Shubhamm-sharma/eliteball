// models/MatchEvent.js
const mongoose = require("mongoose");

const matchEventSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "goal",
        "yellow_card",
        "red_card",
        "substitution",
        "foul",
        "penalty",
        "var_review",
      ],
      required: true,
    },
    minute: { type: Number, required: true }, // 45, 90+3, etc.
    extraTime: { type: Number, default: 0 }, // for 90+3 → minute:90, extraTime:3
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    playerName: {
      type: String,
      trim: true,
    },
    assistedBy: {
      type: mongoose.Schema.Types.ObjectId, // for goals
      ref: "Player",
    },
    assistedByName: {
      type: String,
      trim: true,
    },
    substitutedFor: {
      type: mongoose.Schema.Types.ObjectId, // player coming OFF
      ref: "Player",
    },
    substitutedForName: {
      type: String,
      trim: true,
    },
    description: String, // optional note
  },
  { timestamps: true },
);

matchEventSchema.index({ matchId: 1, minute: 1 });
module.exports = mongoose.model("MatchEvent", matchEventSchema);
