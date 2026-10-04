import { useState } from "react";

function EmergencyRequest() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [emergencyType, setEmergencyType] = useState("");

  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");

  const handleRequest = () => {
    if (!source || !destination || !emergencyType) {
      setError("Please fill all the fields.");
      setRequest(null);
      return;
    }

    setError("");

    const emergencyRequest = {
      source,
      destination,
      emergencyType,
      status: "Requested",
    };

    setRequest(emergencyRequest);
  };

  return (
    <div className="page">
      <header>
        <h1>🚑 Request Emergency Corridor</h1>
        <p>Provide the emergency details to generate a route.</p>
      </header>

      <main>
        <section className="emergency-card">
          <h2>Emergency Details</h2>

          <input
            type="text"
            placeholder="Enter current location"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <select
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
          >
            <option value="">Select Emergency Type</option>
            <option value="medical">Medical Emergency</option>
            <option value="accident">Accident</option>
            <option value="fire">Fire Emergency</option>
            <option value="other">Other</option>
          </select>

          <button onClick={handleRequest}>
            Request Corridor
          </button>

          {error && <p className="error">{error}</p>}
        </section>

        {request && (
          <section className="request-card">
            <h2>🚨 Emergency Request</h2>

            <p>
              <strong>Source:</strong> {request.source}
            </p>

            <p>
              <strong>Destination:</strong> {request.destination}
            </p>

            <p>
              <strong>Emergency:</strong> {request.emergencyType}
            </p>

            <p>
              <strong>Status:</strong> {request.status}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default EmergencyRequest;