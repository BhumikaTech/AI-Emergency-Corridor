import joblib

# Load trained AI model
model = joblib.load("model.pkl")

# New emergency route
new_route = [[6, 3, 0, 1]]

# Predict travel time
prediction = model.predict(new_route)

print("Predicted travel time:", round(prediction[0], 2), "minutes")