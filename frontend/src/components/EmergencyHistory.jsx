import { useEffect, useState } from "react";

function EmergencyHistory() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchEmergencies = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/emergencies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to load emergency history."
        );
        return;
      }

      setEmergencies(data.emergencies || []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  if (loading) {
    return (
      <div className="history-loading">
        Loading emergency history...
      </div>
    );
  }

  if (message) {
    return (
      <div className="history-error">
        {message}
        <button onClick={fetchEmergencies}>Retry</button>
      </div>
    );
  }

  if (emergencies.length === 0) {
    return (
      <div className="empty-history">
        <div className="empty-icon">+</div>

        <h4>No Emergency Requests</h4>

        <p>Your emergency requests will appear here.</p>
      </div>
    );
  }

  return (
    <div className="history-list">

      {emergencies.map((emergency) => (
        <div
          className="history-item"
          key={emergency._id}
        >

          <div className="history-type">
            <div className="history-type-icon">
              {emergency.emergencyType
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {emergency.emergencyType
                  ?.charAt(0)
                  .toUpperCase() +
                  emergency.emergencyType?.slice(1)}
              </strong>

              <span>Emergency Request</span>
            </div>
          </div>

          <div className="history-location">

            <div>
              <span>FROM</span>
              <strong>{emergency.source}</strong>
            </div>

            <div className="arrow">→</div>

            <div>
              <span>TO</span>
              <strong>{emergency.destination}</strong>
            </div>

          </div>

          <div className="history-status">

            <span
              className={`status-badge ${
                emergency.status
                  ?.toLowerCase()
                  .replaceAll(" ", "-")
              }`}
            >
              {emergency.status}
            </span>

            <small>
              {emergency.createdAt
                ? new Date(
                    emergency.createdAt
                  ).toLocaleDateString()
                : "Date unavailable"}
            </small>

            <button
              className="view-details-btn"
              onClick={() => setSelected(emergency)}
            >
              View Details
            </button>

          </div>

        </div>
      ))}

      {selected && (
        <div className="history-details">

          <div className="details-header">
            <h3>Emergency Details</h3>

            <button
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>

          <div className="details-grid">

            <div>
              <span>Emergency Type</span>
              <strong>{selected.emergencyType}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{selected.status}</strong>
            </div>

            <div>
              <span>Source</span>
              <strong>{selected.source}</strong>
            </div>

            <div>
              <span>Destination</span>
              <strong>{selected.destination}</strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {selected.createdAt
                  ? new Date(
                      selected.createdAt
                    ).toLocaleString()
                  : "Unavailable"}
              </strong>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default EmergencyHistory;