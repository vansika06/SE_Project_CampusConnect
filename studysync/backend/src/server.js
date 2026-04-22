const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "DELETE"] },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/groups",   require("./routes/groups"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/files",    require("./routes/files"));
app.use("/api/admin",    require("./routes/admin"));
app.use("/api/messages", require("./routes/messages"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_group", (groupId) => socket.join(groupId));

  socket.on("send_message", async (data) => {
    try {
      // Persist to MongoDB
      const Message = require("./models/Message");
      await Message.create({
        group:      data.groupId,
        sender:     data.senderId,
        senderName: data.senderName,
        content:    data.content,
        isFile:     data.isFile || false,
        fileUrl:    data.fileUrl || null,
        fileName:   data.fileName || null,
      });
    } catch (err) {
      console.error("Failed to save message:", err.message);
    }
    // Broadcast to everyone else in the room
    socket.to(data.groupId).emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.groupId).emit("user_typing", data);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
