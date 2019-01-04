const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    username: req.userData.username
  });
  post.save().then((createdPost) => {
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
      message: 'Creating a post failed'
    })
  });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
  const url = req.protocol + '://' + req.get("host");
  imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
    username: req.userData.username
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.n > 0) {
    res.status(200).json({
      message: "Update successful"
    });
  } else {
    res.status(401).json({ message: 'Not authorized to update this post!' });
  }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Couldn\'t update post'
    });
  });
}

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'posts fetched successfully',
        posts: posts,
      })
    })
    .catch (error => {
      res.status(500).json({
        message: 'Unable to retrieve posts'
      });
    });
}

exports.getUserPosts = (req, res, next) => {
  Post.find( {creator: req.params.id} )
    .then(posts => {
      res.status(200).json({
        message: 'User\'s posts fetched successfully',
        posts: posts
      })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Unable to retrive user\'s posts'
      })
    })
}

exports.getPost =  (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({message: 'Post not found'});
    }
  })
  .catch (error => {
    res.status(500).json({
      message: 'Unable to retrieve post'
    });
  });;
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne( {_id: req.params.id, creator: req.userData.userId }).then((result) => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Deletion successful"
      });
    } else {
      res.status(401).json({ message: 'Not authorized to delete this post!' });
    }
  })
  .catch (error => {
    res.status(500).json({
      message: 'Unable to delete post'
    });
  });
}
