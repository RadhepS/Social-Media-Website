const User = require('../models/user');
var mongoose = require('mongoose');

exports.getUser = (req, res, next) => {

  User.findOne({ username: req.params.username })
    .then(user => {
      if (user) {
        const isInArray = user.following.some(function (followingUsers) { //Checks to see if logged in user is following the user he's requesting
          return followingUsers.equals(req.params.loginId);
        });
        if (isInArray) {
          res.status(200).json({
            message: 'User found',
            user: { id: user._id, username: user.username, isFollowed: true } //Return that the logged in user is following the user he's requesting
          });
        } else {
        res.status(200).json({
          message: 'User found',
          user: { id: user._id, username: user.username, isFollowed: false } //Otherwise return that the logged in user is not following the user he's requesting
        });
      }
      } else {
        throw 'User not found';
      }
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).json({
        message: error.message
      });
    });
};

exports.followUser = (req, res, next) => {
  const loginId = req.body.loginId;
  const followId = req.body.followId;

  //Ensure that the user can't follow himself (Validation)
  if (loginId === followId) {
    return res.status(401).json({ message: 'You cannot follow yourself' });
  }

  User.updateOne(
    { _id: loginId }, //Find the logged-in user
    { $addToSet: { following: followId } } //Add the user he wants to follow into his following list
  )
    .then(result => {
      //Continue if previous update was successful
      if (result.n > 0) {
        User.updateOne(
          { _id: followId }, //Find the user being followed
          { $addToSet: { followers: loginId } } //Add the logged in user to his follower list
        ).then(result => {
          if (result.n > 0) {
            res.status(200).json({
              message: 'Follow successful'
            });
          } else {
            res.status(401).json({ message: 'Follow unsuccessful' });
          }
        });
      } else {
        res.status(401).json({ message: 'Follow unsuccessful' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post"
      });
    });
};
