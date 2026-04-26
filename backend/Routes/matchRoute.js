const router = require("express").Router();
const ctrl = require("../Controller/MatchController");
const { adminAuth } = require("../Middleware/authMiddleware");

router.get("/", ctrl.listMatches);
router.get("/:id", ctrl.getMatchById);
router.post("/", adminAuth, ctrl.createMatch);

module.exports = router;
