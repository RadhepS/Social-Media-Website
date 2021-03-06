const express = require("express");
const checkAuth = require("../middleware/check-auth");

const PostsController = require("../controllers/posts");
const extractFile = require("../middleware/file");
const router = express.Router();

router.post("", checkAuth, extractFile, PostsController.createPost);

router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

router.get("/:limit/:id?", PostsController.getPosts);

router.get("/:limit/:id", PostsController.getPost);

router.get("/userposts/:limit/:id/:loginId", PostsController.getUserPosts);

router.delete("/:id", checkAuth, PostsController.deletePost);

router.post("/likes", extractFile, PostsController.likePost);

router.post("/unlikes", extractFile, PostsController.unlikePost);

router.get("/getLikedUsers/:postId", PostsController.getLikedUsers);

module.exports = router;
