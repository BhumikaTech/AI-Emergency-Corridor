const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    emergencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergency",
      required: true
    },

    distance: {
      type: Number,
      required: true
    },

    estimatedTime: {
      type: Number,
      required: true
    },

    trafficLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true
    },

    roadCondition: {
      type: String,
      enum: ["good", "moderate", "poor"],
      required: true
    },

    aiScore: {
      type: Number,
      default: 0
    },

    isRecommended: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;