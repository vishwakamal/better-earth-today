// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="content">
      <div className="content-box">
        <p>Welcome to BetterEarthToday, your hub for environmental awareness and current news! {/* Rest of the content */}</p>
      </div>
      <Link to="/about">
        <button className="btn">Learn More</button>
      </Link>
    </div>
  );
}

export default HomePage;
