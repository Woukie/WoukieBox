module.exports = function (io, jwt) {
  // Auth middleware
  io.use((socket, next) => {
    console.log(socket.handshake);
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return next(new Error("Invalid token"));
      }

      socket.userId = decoded.userId; // Store user ID for authorization
      next();
    });
  });

  io.on("connection", (socket) => {
    socket.on("join", (params) => {
      console.log("Joined channel " + params.channel);
      socket.join(params.channel);
    });

    socket.on("sendMessage", (data) => {
      console.log(data);
      console.log("Sent message");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  });
};
