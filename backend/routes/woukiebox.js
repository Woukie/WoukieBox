const authenticate = require("../middleware/authenticate");
const User = require("../schemas/user");
const Message = require("../schemas/message");
const Server = require("../schemas/server");
const Channel = require("../schemas/channel");

module.exports = function (app) {
  // Returns a message with the given ID if the users ID is in the servers user_ids list of the server the message was sent in
  app.post("/messages/retrieve", authenticate, function (req, res, next) {});

  // Returns every server the user has joined in an object, where the key is the id, and the value is the server data, i.e {id here: {_id: 12312..., name: "wadaw", channel_ids: [123123..., 2312...], user_ids: [...]}}
  app.post("/servers/retrieve", authenticate, async function (req, res, next) {
    try {
      const user = req.user;

      const servers = await Server.find({ _id: { $in: user.server_ids } });

      const formattedServers = [];
      for (const server of servers) {
        const formattedServer = {
          _id: server._id,
          name: server.name,
          owner_id: server.owner_id,
          user_ids: server.user_ids,
        };

        formattedServers.push(formattedServer);
      }

      res.json(formattedServers);
    } catch (error) {
      next(error); // Handle errors using Express error handling middleware
    }
  });

  // Adds the given server ID to the user and adds the users ID to the servers user list
  app.post("/servers/join", authenticate, function (req, res, next) {});

  // Creates a server with the given name and user_ids entry + owner_id matching the authoring users ID
  app.post("/servers/create", authenticate, async function (req, res, next) {
    try {
      const user = req.user;

      const { name } = req.body;

      if (!name)
        return res.json({
          status: "error",
          message: "Name required",
        });

      if (await Server.findOne({ name }))
        return res.json({
          status: "error",
          message: "Name in use",
        });

      const server = await Server.create({
        name,
        owner_id: user._id,
        user_ids: [user._id],
      });

      user.server_ids.push(server._id);
      user.save();

      res.json({ status: "success", server_id: server._id });
    } catch (error) {
      next(error); // Handle errors using Express error handling middleware
    }
  });

  // Delete the server with the given ID if the users ID matches the servers owner_id
  app.post("/servers/delete", authenticate, function (req, res, next) {});

  // Returns all channel data in an array, given the server_id, and only if the user is a member of said server
  app.post("/channels/retrieve", authenticate, async function (req, res, next) {
    try {
      const user = req.user;

      const { server_id } = req.body;
      if (!server_id)
        return res.json({
          status: "error",
          message: "No specified server id",
        });

      const server = await Server.findById(server_id);

      if (!server.user_ids.includes(user._id)) {
        return res.json({
          status: "error",
          message: "User is not a member of the server",
        });
      }

      const channels = await Channel.find({ _id: { $in: server.channel_ids } });

      const formattedChannels = [];
      for (const channel of channels) {
        const formattedChannel = {
          _id: channel._id,
          name: channel.name,
        };

        formattedChannels.push(formattedChannel);
      }

      res.json(formattedChannels);
    } catch (error) {
      next(error); // Handle errors using Express error handling middleware
    }
  });
};
