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

  // Joins the server with the given name
  app.post("/servers/join", authenticate, async function (req, res, next) {
    try {
      const name = req.body.name;
      const user = req.user;

      if (!name)
        return res.json({
          status: "error",
          message: "Must specify name",
        });

      const server = await Server.findOne({ name });

      if (!server)
        return res.json({
          status: "error",
          message: "Server does not exist",
        });

      if (server.user_ids.includes(user._id))
        return res.json({
          status: "error",
          message: "Already in server",
        });

      server.user_ids.push(user._id);
      user.server_ids.push(server._id);
      user.save();
      server.save();

      res.json({ status: "success", server_id: server._id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  // Creates a channel with the given name
  app.post("/channels/create", authenticate, async function (req, res, next) {
    try {
      const user = req.user;

      const { name, server_id, voice } = req.body;
      if (!server_id)
        return res.json({
          status: "error",
          message: "No specified server id",
        });

      if (!name)
        return res.json({
          status: "error",
          message: "Name required",
        });

      const server = await Server.findById(server_id);

      // It dont work if i dont convert to string
      if (server.owner_id.toString() !== user._id.toString()) {
        return res.json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const channel = await Channel.create({ name, voice, server_id });
      server.channel_ids.push(channel._id);
      server.save();

      res.json({ status: "success", channel_id: channel._id });
    } catch (error) {
      next(error);
    }
  });

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
          voice: channel.voice || false,
        };

        formattedChannels.push(formattedChannel);
      }

      res.json(formattedChannels);
    } catch (error) {
      next(error); // Handle errors using Express error handling middleware
    }
  });
};
