const mongoose = require("mongoose");

const trafficConditionSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true
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
    }
  },
  {
    timestamps: true
  }
);

const TrafficCondition = mongoose.model(
  "TrafficCondition",
  trafficConditionSchema
);

module.exports = TrafficCondition;