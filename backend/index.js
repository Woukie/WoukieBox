const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(
  session({
    secret: "RRARAR!ARARWARW6AWRAWRRAWR#W",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const Account = require("./models/user");
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect(process.env.MONGODB_URI).catch((err) => {
  if (err) {
    console.log("Gay");
    console.log(err);
  }
});

require("./routes/authentication")(app, passport);

app.get("/", (req, res) => {
  res.send("not a big fan of the government");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
