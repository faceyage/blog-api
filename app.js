var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("dotenv").config();
const cors = require("cors");

//passport
const passport = require("passport");
require("./passport");

//routes
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

// gzip/deflate compression for responses
const compression = require("compression");
//helmet to protect against well known vulnerabilities
const helmet = require("helmet");

const app = express();

//setup mongoose connection
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(compression()); // Compress all routes
app.use(helmet());
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/posts/:postid/comments", commentsRouter);

//error handler
app.use((err, req, res, next) => {
  if (Array.isArray(err)) {
    res.json({
      errors: err.map((err) => {
        return {
          message: err.msg,
        };
      }),
    });

    return;
  }

  res.status(err.status || 500);

  res.json({
    error: err,
  });
});

module.exports = app;
