const express = require("express");

const {
  createEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergencyStatus
} = require("../controllers/emergencyController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create emergency
router.post("/", authMiddleware, createEmergency);

// Get all emergencies
router.get("/", authMiddleware, getEmergencies);

// Get one emergency
router.get("/:id", authMiddleware, getEmergencyById);

// Update emergency status
router.put("/:id/status", authMiddleware, updateEmergencyStatus);

module.exports = router;