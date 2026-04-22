const mongoose = require("mongoose");
const SessionSchema = new mongoose.Schema({
  group:     { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  title:     { type: String, required: true },
  date:      String,
  time:      String,
  location:  String,
  duration:  String,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
module.exports = mongoose.model("Session", SessionSchema);
