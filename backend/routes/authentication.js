const authenticate = require("../middleware/authenticate");
const User = require("../models/user");

module.exports = function (app, passport) {
  app.post("/auth/user", authenticate, async function (req, res, next) {
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
};
