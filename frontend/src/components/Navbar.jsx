import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🚑 Emergency Corridor</h2>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/emergency">Emergencies</Link>
        <Link to="/history">History</Link>
      </div>
    </nav>
  );
}

export default Navbar;