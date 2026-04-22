const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const Group = require("../models/Group");
const Message = require("../models/Message");
const { verifyToken } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../../uploads")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { groupId } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileName = req.file.originalname;

    await Group.findByIdAndUpdate(groupId, {
      $push: { files: { name: fileName, url: fileUrl, uploadedBy: req.user.name, uploadedAt: new Date() } },
    });

    await Message.create({
      group: groupId,
      sender: req.user.id,
      senderName: req.user.name,
      content: fileName,
      isFile: true,
      fileUrl,
      fileName,
    });

    res.json({ fileUrl, fileName });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/group/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    res.json(group?.files || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
