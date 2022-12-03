const User = require("../models/user");

const { body, validationResult } = require("express-validator"); //to validate form inputs

//authentication
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");

//!Testing Purposes only
exports.get_users = (req, res, next) => {
  User.find().exec((err, users) => {
    if (err) return next(err);

    //No error return users
    res.json({
      users,
    });
  });
};

exports.create_user = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (username) => {
      const existingUsername = await User.findOne({ username: username });
      if (existingUsername) {
        throw new Error("username already in use!");
      }
    }),
  body("fullname").trim().isLength({ min: 1 }).escape(),
  body("password").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(errors);
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        fullname: req.body.fullname,
      });

      user.save((err) => {
        if (err) return next(err);

        //saved user successfuly
        res.json({
          message: "Signed Up successfully",
          user: user,
        });
      });
    });
  },
];

exports.delete_user = (req, res, next) => {
  User.findByIdAndDelete(req.params.userid, (err, user) => {
    if (err) return next(err);

    //return deleted user
    res.json({
      message: "deleted successfuly",
      user,
    });
  });
};

exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      const error = new Error(info.message);

      return next(error);
    }

    req.login(user, { session: false }, (error) => {
      if (error) return next(error);

      // console.log("User:", user);

      //jwt payload
      const payload = { id: user._id, username: user.username };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });
      return res.json({ payload, token });
    });
  })(req, res, next);
};
