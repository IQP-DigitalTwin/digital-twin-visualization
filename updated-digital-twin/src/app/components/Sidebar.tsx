"use client";
import { useState } from 'react';
import { 
  MdDashboard, 
  MdPlayCircle, 
  MdInsights, 
  MdSettings, 
  MdHelp,
  MdMenu,
  MdChevronLeft 
} from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  return (
    <div 
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div 
        className="sidebarItem"
        onClick={() => router.push('/')}
      >
        <span style={{ color: 'white' }}>⌂ Home</span>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/dashboard">
              <MdDashboard />
              {isExpanded && <span>Dashboard</span>}
            </a>
          </li>
          <li>
            <a href="/simulations">
              <MdPlayCircle />
              {isExpanded && <span>Simulations</span>}
            </a>
          </li>
          <li>
            <a href="/analytics">
              <MdInsights />
              {isExpanded && <span>Analytics</span>}
            </a>
          </li>
          <li>
            <a href="/settings">
              <MdSettings />
              {isExpanded && <span>Settings</span>}
            </a>
          </li>
          <li>
            <a href="/help">
              <MdHelp />
              {isExpanded && <span>Help</span>}
            </a>
          </li>
        </ul>
      </nav>

      <style jsx>{`
        .sidebar {
          width: ${isExpanded ? '250px' : '80px'};
          height: 95vh;
          background-color: #1e293b;
          color: white;
          padding: 1rem;
          transition: all 0.4s ease-in-out;
          position: relative;
          z-index: 100;
          border-radius: 0 24px 24px 0;
          margin: 16px 0;
          margin-left: 8px;
        }
        
        .sidebar:hover {
          box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
        }

        .sidebarItem {
          color: white;
          text-decoration: none;
          font-size: 16px;
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          gap: 16px;
          transition: all 0.4s ease;
          cursor: pointer;
          margin-bottom: 12px;
        }

        .sidebarItem:hover {
          background-color: rgba(255,255,255,0.1);
          transform: translateX(4px);
        }

        nav ul {
          list-style: none;
          padding: 0;
          margin-top: 2rem;
        }

        nav li {
          margin: 12px 0;
        }

        nav a {
          color: white;
          text-decoration: none;
          font-size: 16px;
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          gap: 16px;
          transition: all 0.4s ease;
        }

        nav a:hover {
          background-color: rgba(255,255,255,0.1);
          transform: translateX(4px);
        }

        nav svg {
          font-size: ${isExpanded ? '20px' : '28px'};
          min-width: ${isExpanded ? '20px' : '28px'};
          transition: all 0.4s ease;
        }

        nav span {
          white-space: nowrap;
          opacity: ${isExpanded ? '1' : '0'};
          transition: opacity 0.4s ease;
        }
      `}</style>
    </div>
  );
}
