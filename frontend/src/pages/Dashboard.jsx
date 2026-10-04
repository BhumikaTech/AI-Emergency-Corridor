function Dashboard() {
  return (
    <div className="dashboard">
      <header>
        <h1>🚑 AI Emergency Corridor</h1>
        <p>Emergency Route Management Dashboard</p>
      </header>

      <main>
        <section className="stats-container">
          <div className="stat-card">
            <h3>Active Emergencies</h3>
            <p>0</p>
          </div>

          <div className="stat-card">
            <h3>Corridors Generated</h3>
            <p>0</p>
          </div>

          <div className="stat-card">
            <h3>Completed Emergencies</h3>
            <p>0</p>
          </div>
        </section>

        <section className="recent-section">
          <h2>Recent Emergency Requests</h2>

          <div className="empty-message">
            <p>No active emergencies at the moment.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;