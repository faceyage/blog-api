var express = require("express");
const router = express.Router({ mergeParams: true });

//controller
const commentController = require("../controllers/commentController");
//module to allow only authenticated users for some actions
const passport = require("passport");

//get comments for specific post
router.get("/", commentController.get_comments);

//create comment
router.post("/", commentController.create_comment);

//get single comment
router.get("/:commentid", commentController.get_comment);

//delete comment
router.delete(
  "/:commentid",
  passport.authenticate("jwt", { session: false }),
  commentController.delete_comment
);

module.exports = router;
