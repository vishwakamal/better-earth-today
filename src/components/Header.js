// Header.js

import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="header">
      <h1>Environmental Awareness</h1>

      <div className="nav-button">
        <nav>
          <Link to="/" className="nav-button-link nav-button-link-home">Home</Link>
          <Link to="/about" className="nav-button-link nav-button-link-about">About</Link>
          <Link to="/take-action" className="nav-button-link nav-button-link-take-action">Take Action</Link>
        </nav>
      </div>
    </div>
  );
}

export default Header;
