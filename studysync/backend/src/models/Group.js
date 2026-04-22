const mongoose = require("mongoose");
const GroupSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  subject:     { type: String, default: "General" },
  description: String,
  admin:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  maxMembers:  { type: Number, default: 20 },
  tags:        [String],
  files: [{
    name: String,
    url: String,
    uploadedBy: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });
module.exports = mongoose.model("Group", GroupSchema);
