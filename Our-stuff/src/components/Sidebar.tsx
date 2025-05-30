'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'Home', icon: '▣', href: '/' },
    { name: 'Dashboard', icon: '▣', href: '/dashboard' },
    { name: 'Analytics', icon: '▤', href: '/analytics' },
    { name: 'Reports', icon: '▥', href: '/reports' },
    { name: 'Settings', icon: '▦', href: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <nav className={`sidebar-nav ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link href="/" className="logo-container">
            <div className="logo"></div>
            <span className={`logo-text ${!isOpen && 'hidden'}`}>
              Digital Twin
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="toggle-button"
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="menu-container">
          {menuItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <button className="menu-item">
                <span className="menu-icon">
                  {item.icon}
                </span>
                <span className={!isOpen ? 'hidden' : ''}>
                  {item.name}
                </span>
              </button>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
