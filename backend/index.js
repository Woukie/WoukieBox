require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./schemas/user");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 3000;

const app = express();
const httpserver = require("http").createServer(app);

const io = require("socket.io")(httpserver, {
  cors: {
    origin: "http://localhost:8081",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  require("express-session")({
    secret: "Q9k5dh2C52rjd5atWeaamq#EM!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGODB_URI)
  .catch((err) => {
    if (err) {
      console.log(err);
    }
  })
  .then(() => console.log("Connected to MongoDB"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

require("./routes/authentication")(app, passport, jwt);
require("./routes/woukiebox")(app);
require("./routes/chat")(io, jwt);

app.get("/", (req, res) => {
  res.send("not a big fan of the government");
});

httpserver.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
