const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator"); //to validate form inputs

//get posts
exports.get_posts = (req, res, next) => {
  Post.find().exec((err, posts) => {
    if (err) return next(err);

    res.json({
      posts,
    });
  });
};

// get specific post
exports.get_post = async (req, res, next) => {
  //todo
  try {
    const post = await Post.findById(req.params.postid).populate({
      path: "user",
      select: "fullname",
    });
    console.log(post);
    res.json({
      post,
    });
  } catch (err) {
    return next(err);
  }
};

// create post
exports.create_post = [
  body("title", "title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "content must not be empty").trim().isLength({ min: 1 }).escape(),
  body("user", "user must not be empty").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors);
    }

    User.findById(req.body.user).exec((err, user) => {
      if (err) return next(err);

      //user exist so create post
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.body.user,
      });

      post.save((err, post) => {
        if (err) return next(err);

        res.json({
          message: "Post created successfully",
          post: post,
        });
      });
    });
  },
];

// delete post
exports.delete_post = (req, res, next) => {
  //delete all comments post have before deleting post
  Comment.deleteMany({ post: req.params.postid }, (err, result) => {
    if (err) return next(err);

    //deleted successfuly
    console.log(result);
  });

  //delete post
  Post.findByIdAndRemove(req.params.postid).exec((err, post) => {
    if (err) return next(err);
    if (!post) res.json({ message: "Post not exist" });
    //Post deleted successfully

    //return deleted post
    res.json({ message: "Deleted successfully", post });
  });
};

//update post
exports.update_post = [
  body("title", "title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "content must not be empty").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors);
    }

    Post.findByIdAndUpdate(
      req.params.postid,
      { title: req.body.title, content: req.body.content },
      {},
      (err, thepost) => {
        console.log("Test, err:", err);
        if (err) return next(err);

        res.json({
          post: thepost,
        });
      }
    );
  },
];
