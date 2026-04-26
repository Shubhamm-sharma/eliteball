const router = require("express").Router();
const ctrl = require("../Controller/TeamsController");
const { adminAuth } = require("../Middleware/authMiddleware");

router.get("/", ctrl.listTeams);
router.post("/", adminAuth, ctrl.createTeam);

module.exports = router;
