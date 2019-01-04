const express = require("express");
const UserController = require('../controllers/user')

const router = express.Router();

router.get("/:username", UserController.getUser);

module.exports = router;
