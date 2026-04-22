const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  group:      { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  sender:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName: String,
  content:    String,
  isFile:     { type: Boolean, default: false },
  fileUrl:    String,
  fileName:   String,
}, { timestamps: true });
module.exports = mongoose.model("Message", MessageSchema);
