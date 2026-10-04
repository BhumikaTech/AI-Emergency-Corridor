const { predictTravelTime } = require("./aiService");

async function testAI() {
  try {
    const result = await predictTravelTime(
      6,  // distance
      3,  // traffic
      0,  // blockage
      1   // road condition
    );

    console.log("AI Predicted Travel Time:", result, "minutes");
  } catch (error) {
    console.log("AI test failed");
  }
}

testAI();