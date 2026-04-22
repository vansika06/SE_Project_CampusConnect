const router = require("express").Router();
const Session = require("../models/Session");
const { verifyToken } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().populate("group", "name").sort({ date: 1 });
    res.json(sessions);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/group/:groupId", async (req, res) => {
  try {
    const sessions = await Session.find({ group: req.params.groupId }).populate("group", "name");
    res.json(sessions);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const session = await Session.create({ ...req.body, attendees: [req.user.id] });
    res.json(session);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: "Session deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
