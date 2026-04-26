// routes/matchEvent.routes.js
const router = require("express").Router({ mergeParams: true });
const ctrl = require("../Controller/adminMatchController");
const { adminAuth } = require("../Middleware/authMiddleware"); // your existing auth

// Admin-only event logging
router.post("/", adminAuth, ctrl.addMatchEvent);
router.patch("/score", adminAuth, ctrl.updateScore);
router.patch("/live-state", adminAuth, ctrl.updateLiveState);

// Public — viewer fetches initial state on page load
router.get("/live-state", ctrl.getLiveState);

module.exports = router;

// In your main router:
// app.use("/api/matches/:id/events", matchEventRoutes);
