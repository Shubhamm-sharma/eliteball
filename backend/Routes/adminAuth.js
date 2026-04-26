const router = require("express").Router();
const ctrl = require("../Controller/adminAuthController");

router.post("/login", ctrl.login);

module.exports = router;
