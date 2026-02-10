import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="header-brand">BetterEarthToday</NavLink>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>Events</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>About</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
