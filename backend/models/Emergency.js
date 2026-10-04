const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    emergencyType: {
      type: String,
      enum: ["medical", "accident", "fire", "other"],
      required: true
    },

    source: {
      type: String,
      required: true,
      trim: true
    },

    destination: {
      type: String,
      required: true,
      trim: true
    },

    // AI Input Data
    distance: {
      type: Number,
      required: true
    },

    traffic: {
      type: Number,
      required: true
    },

    blockage: {
      type: Number,
      required: true
    },

    road_condition: {
      type: Number,
      required: true
    },

    // AI Prediction
    predictedTravelTime: {
      type: Number
    },

    status: {
      type: String,
      enum: [
        "Requested",
        "Processing",
        "Corridor Generated",
        "Completed",
        "Cancelled"
      ],
      default: "Requested"
    }
  },
  {
    timestamps: true
  }
);

const Emergency = mongoose.model("Emergency", emergencySchema);

module.exports = Emergency;