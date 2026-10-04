const axios = require("axios");

const predictTravelTime = async (
  distance,
  traffic,
  blockage,
  road_condition
) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/predict",
      {
        distance,
        traffic,
        blockage,
        road_condition
      }
    );

    return response.data.predictedTravelTime;
  } catch (error) {
    console.error("AI prediction error:", error.message);
    throw error;
  }
};

module.exports = {
  predictTravelTime
};