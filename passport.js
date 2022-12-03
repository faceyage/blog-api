// passport.js

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// passport jwt
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//to encrypt password
const bcrypt = require("bcrypt");

// User Model
const User = require("./models/user");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }).exec((err, user) => {
      if (err) return done(err);

      if (!user) return done(null, false, { message: "Username not found" });

      return bcrypt.compare(password, user.password, (err, res) => {
        if (err) return next(err);

        if (res) return done(null, user, { message: "Login success" });
        else return done(null, false, { message: "Incorrect Password" });
      });
    });
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    (jwtPayload, done) => {
      console.log("Payload:", jwtPayload);
      User.findById(jwtPayload.id).exec((err, user) => {
        if (err) return done(err, false);

        console.log("jwtPayload.id: ", jwtPayload);
        console.log("User:", user);
        return done(null, user);
      });
    }
  )
);
