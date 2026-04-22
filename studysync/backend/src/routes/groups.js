const router = require("express").Router();
const Group = require("../models/Group");
const { verifyToken } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("admin", "name")
      .populate("members", "name");
    res.json(groups);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const group = await Group.create({ ...req.body, admin: req.user.id, members: [req.user.id] });
    res.json(group);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/:id/join", verifyToken, async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.user.id } },
      { new: true }
    ).populate("members", "name");
    res.json(group);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/:id/leave", verifyToken, async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: req.user.id } },
      { new: true }
    ).populate("members", "name");
    res.json(group);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: "Group deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
