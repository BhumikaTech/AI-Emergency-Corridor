import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load training data
data = pd.read_csv("training_data.csv")

# Features
X = data[
    [
        "distance",
        "traffic",
        "blockage",
        "road_condition"
    ]
]

# Target
y = data["travel_time"]

# Create AI model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

# Train model
model.fit(X, y)

# Save trained model
joblib.dump(model, "model.pkl")

print("AI model trained successfully!")