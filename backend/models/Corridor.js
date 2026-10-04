const mongoose = require("mongoose");

const corridorSchema = new mongoose.Schema(
  {
    emergencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergency",
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

    emergencyType: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "High"
    },

    corridorStatus: {
      type: String,
      enum: ["Generated", "Active", "Completed"],
      default: "Generated"
    },

    route: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Corridor = mongoose.model("Corridor", corridorSchema);

module.exports = Corridor;