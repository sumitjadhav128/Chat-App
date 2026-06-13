const router = require("express").Router();
const {
  sendMessage,
  getMessages
} = require("../controllers/messageController");

const upload = require("../middleware/uploadMiddleware");


router.post("/",upload.single("attachments"), sendMessage);

router.get("/:conversationId", getMessages);

module.exports = router;