const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

const { updateProfile } = require("../controllers/userController");
const { searchUsers, getAllUsers } = require("../controllers/userController")

router.patch("/updateProfile", authMiddleware, updateProfile);

router.get("/search/:query",authMiddleware, searchUsers);

router.get("/", authMiddleware, getAllUsers);


module.exports = router;