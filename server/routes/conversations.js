const authMiddleware = require("../middleware/authMiddleware")
const router = require("express").Router();
const {
  createConversation,
  getUserConversations,
  createGroupConversation
} = require("../controllers/conversationController");


router.post("/", createConversation);

router.get("/:userId", getUserConversations);

router.post(
  "/group",
  authMiddleware,
  createGroupConversation
);

module.exports = router;