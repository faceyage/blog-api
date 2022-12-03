//models
const Comment = require("../models/comment");
const Post = require("../models/post");
//form body validator
const { body, param, validationResult } = require("express-validator");

//get comments for specific post
exports.get_comments = async (req, res, next) => {
  console.log("Params:", req.params);
  try {
    const post = await Post.findById(req.params.postid);

    if (!post) {
      const error = new Error("Post not exist");
      return next(error);
    }

    const comments = await Comment.find({ post: req.params.postid }).sort({ date_post: "desc" });

    res.json({
      comments,
    });
  } catch (err) {
    return next(err);
  }
};

exports.get_comment = (req, res, next) => {
  Comment.findById(req.params.commentid).exec((err, comment) => {
    if (err) return next(err);

    res.json({
      comment,
    });
  });
};

exports.delete_comment = (req, res, next) => {
  Comment.findByIdAndDelete(req.params.commentid).exec((err, deleted_comment) => {
    if (err) return next(err);

    res.json({
      message: "Comment deleted successfuly",
      comment: deleted_comment,
    });
  });
};

exports.create_comment = [
  body("content", "comment must be specified").trim().isLength({ min: 1 }),
  body("user", "user must be specified").trim().isLength({ min: 1 }),
  param("postid", "post must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (postid) => {
      const post = await Post.findById(postid);

      if (!post) return false;
      else return true;
    })
    .withMessage("Post is not exist"),
  (req, res, next) => {
    console.log("POST ID: ", req.params);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(errors.array());
    }

    console.log("SDFafawsdfasfd");

    const comment = new Comment({
      content: req.body.content,
      user: req.body.user,
      post: req.params.postid,
    });

    comment.save((err, comment) => {
      if (err) return next(err);

      return res.json({ comment });
    });
  },
];
