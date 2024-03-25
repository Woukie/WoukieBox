require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const User = require("./schemas/user");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  require("express-session")({
    secret: "Q9k5dh2C52rjd5atWeaamq#EM!",
    resave: false,
    saveUninitialized: false,
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .catch((err) => {
    if (err) {
      console.log("Gay");
      console.log(err);
    }
  })
  .then(() => console.log("Connected to MongoDB"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/auth/user", async function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send({ status: "error", message: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.send({ status: "error", message: "User not found" });
    }

    return res.send({
      _id: user._id,
      admin: user.admin,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res.send({ status: "error", message: "An error occurred" });
  }
});

app.post("/auth/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({ status: "error", message: "Invalid credentials" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
});

app.post("/auth/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return res.send({ status: "error", message: err.message });
    }
    res.send({ status: "success" });
  });
});

app.post("/auth/register", function (req, res, next) {
  User.register(
    new User({ username: req.body.username, email: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err)
        return res.send({
          status: "error",
          message: err.message,
        });
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.send(user);
      });
    }
  );
});

app.get("/", (req, res) => {
  res.send("not a big fan of the government");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
