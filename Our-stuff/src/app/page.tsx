import './globals.css';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="container">
      <div className="background"></div>
      
      <div className="dashboard">
        <div className="header">
          <h1 className="title">Digital Twin Dashboard</h1>
          <p className="subtitle">
            Predict the energy usage, energy decisions from consumers, and impact of the VNU on Energy Providers in France
          </p>
        </div>

        <div className="button-container">
          <Link href="/new-simulation">
            <button className="new-simulation-button">
              New Simulation
            </button>
          </Link>
        </div>

        <div className="grid-container">
          {['Active Simulations', 'Completed Tasks', 'System Status'].map((title) => (
            <div key={title} className="card">
              <h3 className="card-title">{title}</h3>
              <p className="card-value">0</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
