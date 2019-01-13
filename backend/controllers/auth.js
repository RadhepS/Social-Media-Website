const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser =  (req, res, next) => {
  const lowerCaseUsername = req.body.username.toLowerCase();
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        username: lowerCaseUsername,
        email: req.body.email,
        password: hash,
        followers: [],
        following: []
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
              message: 'Email or username is already taken'
          })
        })
    });
}

exports.userLogin =  (req, res, next) => {
  const lowerCaseUsername = req.body.username.toLowerCase();
  let fetchedUser;
  User.findOne({ username: lowerCaseUsername })
    .then(user => {
      if (!user) {
        throw 'Invalid username';
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials'
      });
    });
}
