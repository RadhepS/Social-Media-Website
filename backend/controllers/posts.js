const Post = require("../models/post");
const User = require("../models/user");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    username: req.userData.username
  });
  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
    username: req.userData.username
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Update successful"
        });
      } else {
        res
          .status(401)
          .json({ message: "Not authorized to update this post!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post"
      });
    });
};

exports.getPosts = (req, res, next) => {
  let num = parseInt(req.params.limit);
  num += 6;
  Post.find()
    .limit(num)
    .then(posts => {
      if (req.params.id) {
        posts.forEach(function(post) {
          post.likesUsers.forEach(function(likedUser) {
            if (likedUser.toString() == req.params.id) {
              post.liked = true;
            }
          });
        });
      }
      res.status(200).json({
        message: "posts fetched successfully",
        posts: posts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Unable to retrieve posts"
      });
    });
};

exports.getUserPosts = (req, res, next) => {
  let num = parseInt(req.params.limit);
  num += 6;
  Post.find({ creator: req.params.id })
    .limit(num)
    .then(posts => {
      if (req.params.loginId) {
        posts.forEach(function(post) {
          post.likesUsers.forEach(function(likedUser) {
            if (likedUser.toString() == req.params.loginId) {
              post.liked = true;
            }
          });
        });
      }
      res.status(200).json({
        message: "User's posts fetched successfully",
        posts: posts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Unable to retrive user's posts"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        return res.status(200).json(post);
      } else {
        return res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Unable to retrieve post"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Deletion successful"
        });
      } else {
        res
          .status(401)
          .json({ message: "Not authorized to delete this post!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Unable to delete post"
      });
    });
};

exports.likePost = (req, res, next) => {
  const postId = req.body.postId;
  const likedByUserId = req.body.userId;
  const postCreatorId = req.body.postCreator;

  //Ensure that a user cannot like their own post (Validation)
  if (postCreatorId === likedByUserId) {
    return res.status(401).json({ message: "You cannot like your own post" });
  }

  Post.updateOne(
    { _id: postId }, //Find the logged-in user
    { $addToSet: { likesUsers: likedByUserId } } //Add the user to the like list
  ) //Continue if previous update was successful
    .then(result => {
      if (result.nModified > 0) {
        Post.findByIdAndUpdate(
          postId,
          { $inc: { likeCount: 1 } },
          { new: true }
        )
          .then(result => {
            if (result) {
              res.status(200).json({
                message: "Like successful",
                likeCount: result.likeCount
              });
            }
          })
          .catch(error => {
            res.status(500).json({
              message: "Couldn't update post"
            });
          });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post"
      });
    });
};

exports.unlikePost = (req, res, next) => {
  const postId = req.body.postId;
  const likedByUserId = req.body.userId;
  const postCreatorId = req.body.postCreator;

  //Ensure that a user cannot like their own post (Validation)
  if (postCreatorId === likedByUserId) {
    return res.status(401).json({ message: "You cannot unlike your own post" });
  }

  Post.updateOne(
    { _id: postId }, //Find the logged-in user
    { $pull: { likesUsers: likedByUserId } } //Remove the user from the like list
  ) //Continue if previous update was successful
    .then(result => {
      if (result.nModified > 0) {
        Post.findByIdAndUpdate(
          postId,
          { $inc: { likeCount: -1 } },
          { new: true }
        )
          .then(result => {
            if (result) {
              res.status(200).json({
                message: "Unlike successful",
                likeCount: result.likeCount
              });
            }
          })
          .catch(error => {
            res.status(500).json({
              message: "Couldn't update post"
            });
          });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post"
      });
    });
};

exports.getLikedUsers = (req, res, next) => {
  Post.findById(req.params.postId)
    .then(result => {
      User.find({
        _id: {
          $in: result.likesUsers
        }
      })
        .then(result => {
          const formattedUserData = result.map(user => ({
            name: user.username,
            followerCount: user.followers.length,
            followingCount: user.following.length
          }));
          res.status(200).json({
            message: "Retrieved liked users successfully",
            likedUsers: formattedUserData
          });
        })
        .catch(error => {
          res.status(500).json({
            message: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: error
      });
    });
};
