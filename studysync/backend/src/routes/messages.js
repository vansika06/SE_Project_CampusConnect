const router = require("express").Router();
const Message = require("../models/Message");

// GET all messages for a group
router.get("/group/:groupId", async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
