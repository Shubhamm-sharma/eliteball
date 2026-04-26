const Team = require("../Models/TeamSchema");

const cleanText = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

exports.listTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const name = cleanText(req.body?.name);
    const logo = cleanText(req.body?.logo);

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Team name is required" });
    }

    const existingTeam = await Team.findOne({ name });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "A team with this name already exists",
      });
    }

    const team = await Team.create({
      name,
      logo: logo || null,
    });

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
