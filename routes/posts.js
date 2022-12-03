var express = require("express");
var router = express.Router();

//module to allow only authenticated users for some actions
const passport = require("passport");

//controllers
const postController = require("../controllers/postController");

const { response } = require("express");

// get posts
router.get("/", postController.get_posts);

// get specific post
router.get("/:postid", postController.get_post);

// create post
router.post("/", passport.authenticate("jwt", { session: false }), postController.create_post);

//delete post
router.delete(
  "/:postid",
  passport.authenticate("jwt", { session: false }),
  postController.delete_post
);

//update post
router.put(
  "/:postid",
  passport.authenticate("jwt", { session: false }),
  postController.update_post
);

module.exports = router;
