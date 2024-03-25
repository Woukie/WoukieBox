const authenticate = require("../middleware/authenticate");
const User = require("../schemas/user");
const Message = require("../schemas/message");
const Server = require("../schemas/server");
const Channel = require("../schemas/channel");

module.exports = function (app, passport, io) {
  // Returns a message with the given ID if the users ID is in the servers user_ids list of the server the message was sent in
  app.post("/messages/retrieve", authenticate, function (req, res, next) {});

  // Returns name, channels and users of the server with the given ID
  app.post("/servers/retrieve", authenticate, function (req, res, next) {});

  // Adds the given server ID to the user and adds the users ID to the servers user list
  app.post("/servers/join", authenticate, function (req, res, next) {});

  // Creates a server with the given name and owner_id matching the users ID
  app.post("/servers/create", authenticate, function (req, res, next) {});

  // Delete the server with the given ID if the users ID matches the servers owner_id
  app.post("/servers/delete", authenticate, function (req, res, next) {});
};
