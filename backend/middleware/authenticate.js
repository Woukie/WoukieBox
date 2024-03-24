function authenticate(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send({ status: "error", message: "Not authenticated" });
  }

  next();
}

module.exports = authenticate;
