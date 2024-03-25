require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const User = require("./schemas/user");
const { Server } = require("socket.io");
const http = require("http");

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8081",
    credentials: true,
  },
});

const sessionMiddleware = require("express-session")({
  secret: "Q9k5dh2C52rjd5atWeaamq#EM!",
  resave: false,
  saveUninitialized: false,
});

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

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

require("./routes/authentication")(app, passport);
require("./routes/woukiebox")(app, passport, io);

app.get("/", (req, res) => {
  res.send("not a big fan of the government");
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
