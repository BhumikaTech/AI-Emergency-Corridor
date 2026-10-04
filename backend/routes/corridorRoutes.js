const express = require("express");

const {
  generateCorridor
} = require("../controllers/corridorController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Generate emergency corridor
router.post("/generate", authMiddleware, generateCorridor);

module.exports = router;