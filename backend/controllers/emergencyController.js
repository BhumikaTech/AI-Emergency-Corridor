const Emergency = require("../models/Emergency");
const { predictTravelTime } = require("../aiService");

// Create Emergency
const createEmergency = async (req, res) => {
  try {
    const {
      emergencyType,
      source,
      destination,
      distance,
      traffic,
      blockage,
      road_condition
    } = req.body;

    // Check required fields
    if (
      !emergencyType ||
      !source ||
      !destination ||
      distance === undefined ||
      traffic === undefined ||
      blockage === undefined ||
      road_condition === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide emergency type, source, destination, distance, traffic, blockage and road condition"
      });
    }

    // Ask AI to predict travel time
    const predictedTravelTime = await predictTravelTime(
      distance,
      traffic,
      blockage,
      road_condition
    );

    // Create emergency with AI prediction
    const emergency = await Emergency.create({
      userId: req.user.userId,
      emergencyType,
      source,
      destination,
      distance,
      traffic,
      blockage,
      road_condition,
      predictedTravelTime
    });

    res.status(201).json({
      message: "Emergency request created successfully",
      emergency
    });

  } catch (error) {
    console.error("Create emergency error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get All Emergencies of Logged-in User
const getEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Emergencies fetched successfully",
      emergencies
    });

  } catch (error) {
    console.error("Get emergencies error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get One Emergency by ID
const getEmergencyById = async (req, res) => {
  try {
    const emergency = await Emergency.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!emergency) {
      return res.status(404).json({
        message: "Emergency not found"
      });
    }

    res.status(200).json({
      message: "Emergency fetched successfully",
      emergency
    });

  } catch (error) {
    console.error("Get emergency error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update Emergency Status
const updateEmergencyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Requested",
      "Processing",
      "Corridor Generated",
      "Completed",
      "Cancelled"
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid emergency status"
      });
    }

    const emergency = await Emergency.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!emergency) {
      return res.status(404).json({
        message: "Emergency not found"
      });
    }

    emergency.status = status;

    await emergency.save();

    res.status(200).json({
      message: "Emergency status updated successfully",
      emergency
    });

  } catch (error) {
    console.error("Update emergency status error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergencyStatus
};