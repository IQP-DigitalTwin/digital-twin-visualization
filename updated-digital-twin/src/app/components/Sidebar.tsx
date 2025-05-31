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
          position: relative;
          height: 95vh;
          background: white;
          color: #2d3748;
          padding: 1rem;
          width: 80px;
          position: relative;
          z-index: 100;
          border-radius: 0 24px 24px 0;
          margin: 16px 0;
          margin-left: 8px;
          box-shadow: 4px 0 12px rgba(0, 0, 0, 0.05);
          transform-origin: left;
          transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: width;
          overflow-x: hidden;
        }
        
        .sidebar.expanded {
          width: 250px;
        }

        nav span {
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.1s ease;
        }

        .sidebar.expanded nav span {
          opacity: 1;
          transition-delay: 0.1s;
        }

        nav svg {
          min-width: 24px;
          font-size: 24px;
          transition: none;
        }

        .sidebarItem,
        nav a {
          color: #2d3748;
          text-decoration: none;
          font-size: 16px;
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          gap: 16px;
          transition: background-color 0.2s ease;
          white-space: nowrap;
        }

        .sidebarItem:hover,
        nav a:hover {
          background-color: #f7fafc;
          transform: translateX(4px);
        }

        nav ul {
          list-style: none;
          padding: 0;
          margin-top: 2rem;
        }

        nav li {
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
}
