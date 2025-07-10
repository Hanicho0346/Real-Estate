const express = require("express");
const { shouldBeLoggedIn, shouldBeAdmin } = require("../controller/testcontroller.js");
const verifyToken = require("../middleware/verifytoken.js");
const router = express.Router();


router.get("/shouldBeLoggedIn", verifyToken, shouldBeLoggedIn);
router.get("/shouldBeAdmin", verifyToken, shouldBeAdmin);

module.exports = router;