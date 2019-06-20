const express = require("express");
const UserController = require('../controllers/user')

const router = express.Router();



router.get("/followerlist/:userId", UserController.getFollowerList);

router.get("/followingList/:userId", UserController.getFollowingList);

router.get("/:username/:loginId", UserController.getUser);

router.post("/follow", UserController.followUser);

router.post("/unfollow", UserController.unfollowUser);

module.exports = router;
