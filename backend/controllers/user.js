const User = require('../models/user');

exports.getUser =  (req, res, next) => {
  console.log(req.params.username);

  User.findOne({ username: req.params.username }).then((user) => {
    if (user) {
      res.status(200).json({
        message: 'User found',
        user: { id: user._id, username: user.username }
      });
    } else {
      throw 'User not found'
    }
  })
  .catch (error => {
    res.status(500).json({
      message: error
    });
  });

}
