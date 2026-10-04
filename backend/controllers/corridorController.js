const Emergency = require("../models/Emergency");
const Corridor = require("../models/Corridor");

// Generate Emergency Corridor
const generateCorridor = async (req, res) => {
  try {
    const { emergencyId } = req.body;

    // Check emergency ID
    if (!emergencyId) {
      return res.status(400).json({
        message: "Please provide emergency ID"
      });
    }

    // Find emergency belonging to logged-in user
    const emergency = await Emergency.findOne({
      _id: emergencyId,
      userId: req.user.userId
    });

    if (!emergency) {
      return res.status(404).json({
        message: "Emergency not found"
      });
    }

    // Decide priority based on emergency type
    let priority = "Medium";

    if (
      emergency.emergencyType === "medical" ||
      emergency.emergencyType === "accident" ||
      emergency.emergencyType === "fire"
    ) {
      priority = "High";
    }

    // Simple route generation
    const route = `${emergency.source} → Emergency Corridor → ${emergency.destination}`;

    // Create corridor
    const corridor = await Corridor.create({
      emergencyId: emergency._id,
      source: emergency.source,
      destination: emergency.destination,
      emergencyType: emergency.emergencyType,
      priority,
      corridorStatus: "Generated",
      route
    });

    // Update emergency status
    emergency.status = "Corridor Generated";

    await emergency.save();

    res.status(201).json({
      message: "Emergency corridor generated successfully",
      corridor
    });

  } catch (error) {
    console.error("Generate corridor error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  generateCorridor
};