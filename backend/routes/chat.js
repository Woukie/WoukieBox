const Server = require("../schemas/server");
const User = require("../schemas/user");
const Channel = require("../schemas/channel");
const Message = require("../schemas/message");

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
          socket.join(channel._id.toString());
          console.log(`${socket.user.username} joined ${channel._id}`);
        }
      }
    } catch (error) {
      console.log(error);
      // Idfk
    }

    socket.on("join_channel", async (data, callback) => {
      const user = socket.user;

      if (!data.channel_id) {
        callback("no channel_id");
        return;
      }

      const channel = await Channel.findById(data.channel_id);
      const server = await Server.findById(channel.server_id);

      if (!server.user_ids.includes(user._id)) {
        callback("Not authorized");
        return;
      }

      socket.join(channel._id.toString());
      console.log(`${socket.user.username} joined ${channel._id}`);
      callback("joined channel");
    });

    socket.on("message", async (data, callback) => {
      // TODO: Check if user has perms to send message to data.channel

      const user = socket.user;

      if (!data.channel_id) return callback("no channel_id");
      if (!data.content) return callback("no content");

      const channel = await Channel.findById(data.channel_id);

      const newMessage = await Message.create({
        parent_id: channel.last_message_id || null,
        sender_id: user._id,
        channel_id: data.channel_id,
        content: data.content,
      });

      // Update previous messages child to point to new message
      const lastMessage = await Message.findById(channel.last_message_id);
      if (lastMessage) {
        lastMessage.child_id = newMessage._id;
        lastMessage.save();
      }

      // Update channels latest message
      channel.last_message_id = newMessage._id;
      channel.save();

      newMessage.save();

      io.to(data.channel_id).emit("message", {
        _id: newMessage._id,
        parent_id: newMessage.parent_id,
        sender_id: newMessage.sender_id,
        channel_id: newMessage._id,
        sent_at: newMessage.sent_at,
        content: newMessage.content,
      });

      callback("success");

      console.log(
        `${socket.user.username} sent '${data.content}' to ${data.channel_id}`
      );
    });

    socket.on("disconnect", () => {
      console.log(socket.user.username + " disconnected");
    });
  });
};
