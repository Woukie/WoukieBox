const Server = require("../schemas/server");
const User = require("../schemas/user");
const Channel = require("../schemas/channel");

module.exports = function (io, jwt) {
  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);
        return next(new Error("Invalid token"));
      }

      const user = await User.findById(decoded.userId);

      socket.user = user;
      next();
    });
  });

  io.on("connection", async (socket) => {
    console.log(`${socket.user.username} connected`);

    try {
      const servers = await Server.find({
        _id: { $in: socket.user.server_ids },
      });

      for (const server of servers) {
        if (!server.user_ids.includes(socket.user._id)) {
          continue;
        }

        const channels = await Channel.find({
          _id: { $in: server.channel_ids },
        });

        for (const channel of channels) {
          socket.join(channel._id);
          console.log(`${socket.user.username} joined ${channel._id}`);
        }
      }
    } catch (error) {
      console.log(error);
      // Idfk
    }

    socket.on("send_message", (data) => {
      // TODO: Check if user has perms to send message to data.channel
      io.to(data.channel).emit("on_message", {
        message: data.message,
        sender: socket.userId,
      });

      console.log(
        socket.user.username +
          " sent message '" +
          data.message +
          "' to " +
          data.room
      );
    });

    socket.on("disconnect", () => {
      console.log(socket.user.username + " disconnected");
    });
  });
};
