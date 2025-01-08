import { saveChatMessages } from "../controllers/Messages.controller";

function SetupSocket(httpServer) {
  const io = require("socket.io")(httpServer, {
    cors: {
      origin: [process.env.REACT_APP_CORS_URL],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Chat Socket ${socket.id} connected`);

    //chat events
    socket.on("sendMessage", async (messageObj) => {
      saveChatMessages(messageObj);
      io.emit("message", messageObj);
    });

    //video events
    socket.emit("me", socket.id);
    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
    });
    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });
}
export default SetupSocket;
