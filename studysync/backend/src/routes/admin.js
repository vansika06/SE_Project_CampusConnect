const router = require("express").Router();
const User = require("../models/User");
const Group = require("../models/Group");
const Message = require("../models/Message");
const Session = require("../models/Session");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.use(verifyToken, isAdmin);

router.get("/stats", async (req, res) => {
  try {
    const [users, groups, messages, sessions] = await Promise.all([
      User.countDocuments(),
      Group.countDocuments(),
      Message.countDocuments(),
      Session.countDocuments(),
    ]);
    res.json({ users, groups, messages, sessions });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("admin", "name email")
      .populate("members", "name");
    res.json(groups);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("group", "name")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/message/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/group/:id", async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
