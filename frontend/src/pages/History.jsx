function History() {
  const emergencies = [
    {
      id: 1,
      type: "Medical Emergency",
      source: "Patiala",
      destination: "Chandigarh",
      status: "Completed",
    },
    {
      id: 2,
      type: "Accident",
      source: "Mansa",
      destination: "Patiala",
      status: "Completed",
    },
  ];

  return (
    <div className="history-page">
      <header>
        <h1>📋 Emergency History</h1>
        <p>View previous emergency corridor requests</p>
      </header>

      <main>
        <section className="history-container">
          {emergencies.map((emergency) => (
            <div className="history-card" key={emergency.id}>
              <h2>{emergency.type}</h2>

              <p>
                <strong>Source:</strong> {emergency.source}
              </p>

              <p>
                <strong>Destination:</strong> {emergency.destination}
              </p>

              <p>
                <strong>Status:</strong> {emergency.status}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default History;