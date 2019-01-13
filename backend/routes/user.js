const express = require("express");
const UserController = require('../controllers/user')

const router = express.Router();



router.get("/:username/:loginId", UserController.getUser);

router.post("/follow", UserController.followUser);

module.exports = router;
