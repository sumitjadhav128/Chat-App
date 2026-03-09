const router = require("express").Router();
const {
  createConversation,
  getUserConversations
} = require("../controllers/conversationController");


router.post("/", createConversation);

router.get("/:userId", getUserConversations);

module.exports = router;