import { useState } from "react";

import Login from "./Login";
import EmergencyHistory from "./components/EmergencyHistory";
import EmergencyMap from "./components/EmergencyMap";

import "./App.css";

const API = "http://localhost:5000";


// ==========================================
// GET LOCATION COORDINATES
// ==========================================

const getCoordinates = async (location) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=in&q=${encodeURIComponent(
      `${location}, India`
    )}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to find location.");
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error(`Location not found in India: ${location}`);
  }

  const result =
    data.find((item) =>
      item.display_name?.toLowerCase().includes("india")
    ) || data[0];

  const lat = parseFloat(result.lat);
  const lon = parseFloat(result.lon);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    throw new Error(`Invalid coordinates for: ${location}`);
  }

  return {
    lat,
    lon,
  };
};


// ==========================================
// GET REAL ROAD ROUTE
// ==========================================

const getRoute = async (source, destination) => {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${source.lon},${source.lat};${destination.lon},${destination.lat}` +
    `?overview=full&geometries=geojson`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to calculate route.");
  }

  const data = await response.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error("No road route found between the locations.");
  }

  const route = data.routes[0];

  return {
    coordinates: route.geometry.coordinates.map(
      ([lon, lat]) => [lat, lon]
    ),

    // Distance from actual road route
    distance: (route.distance / 1000).toFixed(2),

    // OSRM estimated duration
    duration: Math.round(route.duration / 60),
  };
};


// ==========================================
// MAIN APP
// ==========================================

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // ==========================================
  // EMERGENCY FORM
  // ==========================================

  const [emergencyType, setEmergencyType] =
    useState("medical");

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [corridor, setCorridor] = useState(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  // ==========================================
  // MAP
  // ==========================================

  const [sourceCoordinates, setSourceCoordinates] =
    useState(null);

  const [destinationCoordinates, setDestinationCoordinates] =
    useState(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState([]);

  // ==========================================
  // PRIORITY
  // ==========================================

  const priority =
    emergencyType === "medical" ||
    emergencyType === "accident"
      ? "High"
      : "Medium";


  // ==========================================
  // LOCAL CORRIDOR
  // ==========================================

  const createLocalCorridor = (
    distance,
    duration,
    predictedTravelTime
  ) => ({
    emergencyType,
    priority,
    source,
    destination,
    corridorStatus: "Generated",
    route: "Real road route generated",
    distance,
    duration,
    predictedTravelTime,
  });


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };


  // ==========================================
  // CREATE EMERGENCY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!source.trim() || !destination.trim()) {
      setMessage(
        "Please enter both current location and destination."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setCorridor(null);

    setSourceCoordinates(null);
    setDestinationCoordinates(null);
    setRouteCoordinates([]);

    try {

      // ==========================================
      // STEP 1: FIND LOCATIONS
      // ==========================================

      setMessage("Finding locations...");

      const [
        sourceCoords,
        destinationCoords,
      ] = await Promise.all([
        getCoordinates(source),
        getCoordinates(destination),
      ]);

      setSourceCoordinates(sourceCoords);
      setDestinationCoordinates(destinationCoords);


      // ==========================================
      // STEP 2: GET REAL ROAD ROUTE
      // ==========================================

      setMessage("Calculating real road route...");

      const route = await getRoute(
        sourceCoords,
        destinationCoords
      );

      setRouteCoordinates(route.coordinates);


      // ==========================================
      // STEP 3: AI INPUTS
      // ==========================================

      // Distance comes from the real OSRM road route.
      const distance = Number(route.distance);

      // Prototype AI inputs.
      // Later these can be replaced with real-time data.
      const traffic = 3;
      const blockage = 0;
      const road_condition = 1;


      // ==========================================
      // STEP 4: LOGIN TOKEN
      // ==========================================

      const token = localStorage.getItem("token");

      if (!token) {

        setCorridor(
          createLocalCorridor(
            route.distance,
            route.duration,
            null
          )
        );

        setMessage(
          "Route generated successfully. Login is required to save the emergency."
        );

        return;
      }


      // ==========================================
      // STEP 5: SEND EMERGENCY TO BACKEND + AI
      // ==========================================

      setMessage("AI is predicting travel time...");

      const emergencyResponse = await fetch(
        `${API}/api/emergencies`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            emergencyType,
            source,
            destination,

            // AI INPUTS
            distance,
            traffic,
            blockage,
            road_condition,
          }),
        }
      );


      const emergencyData =
        await emergencyResponse.json();


      // ==========================================
      // STEP 6: CHECK AI RESPONSE
      // ==========================================

      if (!emergencyResponse.ok) {

        setCorridor(
          createLocalCorridor(
            route.distance,
            route.duration,
            null
          )
        );

        setMessage(
          emergencyData.message ||
            "Route generated, but emergency could not be saved."
        );

        return;
      }


      const emergency =
        emergencyData.emergency || {};

      const emergencyId =
        emergency._id;

      const predictedTravelTime =
        emergency.predictedTravelTime;


      if (!emergencyId) {

        setCorridor(
          createLocalCorridor(
            route.distance,
            route.duration,
            predictedTravelTime
          )
        );

        setMessage(
          "AI prediction received, but emergency ID was not received."
        );

        return;
      }


      // ==========================================
      // STEP 7: SHOW AI RESULT
      // ==========================================

      console.log(
        "AI Predicted Travel Time:",
        predictedTravelTime,
        "minutes"
      );


      // ==========================================
      // STEP 8: GENERATE EMERGENCY CORRIDOR
      // ==========================================

      setMessage(
        "Generating emergency corridor..."
      );

      const corridorResponse = await fetch(
        `${API}/api/corridors/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            emergencyId,
          }),
        }
      );


      const corridorData =
        await corridorResponse.json();


      if (!corridorResponse.ok) {

        setCorridor(
          createLocalCorridor(
            route.distance,
            route.duration,
            predictedTravelTime
          )
        );

        setMessage(
          corridorData.message ||
            "AI prediction generated, but corridor could not be saved."
        );

        return;
      }


      // ==========================================
      // STEP 9: FINAL CORRIDOR DATA
      // ==========================================

      const backendCorridor =
        corridorData.corridor || {};


      setCorridor({
        ...createLocalCorridor(
          route.distance,
          route.duration,
          predictedTravelTime
        ),

        ...backendCorridor,

        emergencyType:
          backendCorridor.emergencyType ||
          emergencyType,

        source:
          backendCorridor.source ||
          source,

        destination:
          backendCorridor.destination ||
          destination,

        corridorStatus:
          backendCorridor.corridorStatus ||
          "Generated",

        route:
          backendCorridor.route ||
          "Real road route generated",

        distance:
          route.distance,

        duration:
          route.duration,

        // IMPORTANT:
        // This is the AI prediction.
        predictedTravelTime:
          predictedTravelTime,
      });


      setMessage(
        "Emergency corridor generated successfully."
      );


      setSource("");
      setDestination("");

      setHistoryRefresh(
        (prev) => prev + 1
      );

    } catch (error) {

      console.error(error);

      setMessage(
        error.message ||
          "Unable to generate emergency route."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // LOGIN SCREEN
  // ==========================================

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() =>
          setIsLoggedIn(true)
        }
      />
    );
  }


  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div className="brand">

          <div className="brand-logo">
            A
          </div>

          <div>

            <h1>
              AI Emergency Corridor
            </h1>

            <p>
              Emergency Response System
            </p>

          </div>

        </div>


        <div className="header-right">

          <div className="online-status">

            <span></span>

            System Online

          </div>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      <main className="dashboard-content">

        {/* INTRO */}

        <section className="intro">

          <span className="small-label">
            EMERGENCY MANAGEMENT
          </span>

          <h2>
            Emergency Response Dashboard
          </h2>

          <p>
            Create an emergency request and generate
            a dedicated emergency corridor.
          </p>

        </section>


        {/* REQUEST CARD */}

        <section className="request-card">

          <div className="card-heading">

            <div className="heading-icon">
              !
            </div>

            <div>

              <h3>
                New Emergency Request
              </h3>

              <p>
                Provide the emergency details below.
              </p>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* EMERGENCY TYPE */}

              <div className="input-group">

                <label>
                  Emergency Type
                </label>

                <select
                  value={emergencyType}
                  onChange={(e) =>
                    setEmergencyType(
                      e.target.value
                    )
                  }
                >

                  <option value="medical">
                    Medical Emergency
                  </option>

                  <option value="accident">
                    Accident
                  </option>

                  <option value="fire">
                    Fire
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>

              </div>


              {/* SOURCE */}

              <div className="input-group">

                <label>
                  Current Location
                </label>

                <input
                  type="text"
                  placeholder="Enter current location"
                  value={source}
                  onChange={(e) =>
                    setSource(e.target.value)
                  }
                  required
                />

              </div>


              {/* DESTINATION */}

              <div className="input-group">

                <label>
                  Destination
                </label>

                <input
                  type="text"
                  placeholder="Enter hospital or destination"
                  value={destination}
                  onChange={(e) =>
                    setDestination(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>


            <button
              type="submit"
              className="generate-btn"
              disabled={loading}
            >

              {loading
                ? "Generating Corridor..."
                : "Generate Emergency Corridor"}

            </button>

          </form>


          {message && (

            <div
              className={
                corridor
                  ? "message success"
                  : "message error"
              }
            >

              {message}

            </div>

          )}

        </section>


        {/* CORRIDOR RESULT */}

        {corridor && (

          <section className="corridor-card">

            <div className="corridor-header">

              <div>

                <span className="success-label">
                  CORRIDOR GENERATED
                </span>

                <h3>
                  Emergency Route Ready
                </h3>

              </div>

              <div className="success-icon">
                ✓
              </div>

            </div>


            <div className="corridor-grid">

              {[
                [
                  "Emergency Type",
                  corridor.emergencyType,
                ],

                [
                  "Priority",
                  corridor.priority || "High",
                ],

                [
                  "Source",
                  corridor.source,
                ],

                [
                  "Destination",
                  corridor.destination,
                ],

                [
                  "Distance",
                  corridor.distance
                    ? `${corridor.distance} km`
                    : "Calculating...",
                ],

                [
                  "OSRM Route Time",
                  corridor.duration
                    ? `${corridor.duration} min`
                    : "Calculating...",
                ],

                [
                  "AI Predicted Time",
                  corridor.predictedTravelTime
                    ? `${corridor.predictedTravelTime} min`
                    : "Calculating...",
                ],

                [
                  "Corridor Status",
                  corridor.corridorStatus,
                ],

              ].map(
                ([label, value]) => (

                  <div
                    className="detail"
                    key={label}
                  >

                    <span>
                      {label}
                    </span>

                    <strong>
                      {value}
                    </strong>

                  </div>

                )
              )}


              <div className="detail route-detail">

                <span>
                  Route
                </span>

                <strong>

                  🛣️{" "}

                  {corridor.route ||
                    "Real road route generated"}

                </strong>

              </div>

            </div>

          </section>

        )}


        {/* MAP */}

        <section className="map-card">

          <div className="history-heading">

            <div>

              <span className="small-label">
                LIVE ROUTE
              </span>

              <h3>
                Emergency Map
              </h3>

              <p>
                View the emergency location and
                route on the map.
              </p>

            </div>

          </div>


          <EmergencyMap
            sourceCoordinates={
              sourceCoordinates
            }

            destinationCoordinates={
              destinationCoordinates
            }

            routeCoordinates={
              routeCoordinates
            }
          />

        </section>


        {/* HISTORY */}

        <section className="history-card">

          <div className="history-heading">

            <div>

              <span className="small-label">
                ACTIVITY
              </span>

              <h3>
                Emergency History
              </h3>

              <p>
                Your previous emergency requests.
              </p>

            </div>

          </div>


          <EmergencyHistory
            refresh={historyRefresh}
          />

        </section>

      </main>


      {/* FOOTER */}

      <footer>

        AI Emergency Corridor

        <span>
          •
        </span>

        Emergency Response Management System

      </footer>

    </div>
  );
}

export default App;