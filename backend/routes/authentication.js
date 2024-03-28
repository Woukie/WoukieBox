const authenticate = require("../middleware/authenticate");
const User = require("../schemas/user");

module.exports = function (app, passport, jwt) {
  // Sends user data if user is authenticated
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

  // Logs user in with given credentials and returns user data if successfull
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

        // Generate JWT for socket.io shit
        const payload = { userId: user._id };
        const options = { expiresIn: "1h" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);

        return res.send({
          status: "success",
          token,
        });
      });
    })(req, res, next);
  });

  // Logs user out
  app.post("/auth/logout", function (req, res, next) {
    req.logOut(function (err) {
      if (err) {
        return res.send({ status: "error", message: err.message });
      }
      res.send({ status: "success" });
    });
  });

  // Registers and logs user in with given credentials and returns user data if successfull
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

          const payload = { userId: user._id };
          const options = { expiresIn: "1h" };
          const token = jwt.sign(payload, process.env.JWT_SECRET, options);

          return res.send({ status: "success", token });
        });
      }
    );
  });
};
