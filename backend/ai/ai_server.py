from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load trained AI model
model = joblib.load("model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    distance = data["distance"]
    traffic = data["traffic"]
    blockage = data["blockage"]
    road_condition = data["road_condition"]

    prediction = model.predict([
        [distance, traffic, blockage, road_condition]
    ])

    predicted_time = round(float(prediction[0]), 2)

    return jsonify({
        "predictedTravelTime": predicted_time
    })


@app.route("/", methods=["GET"])
def home():
    return "AI Emergency Corridor AI Server is running!"


if __name__ == "__main__":
    app.run(port=5001, debug=True)