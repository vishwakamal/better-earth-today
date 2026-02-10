function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>&copy; {new Date().getFullYear()} BetterEarthToday — Built with React + Live APIs</p>
        <div className="footer-links">
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
          <a href="https://earthquake.usgs.gov/" target="_blank" rel="noopener noreferrer">USGS</a>
          <a href="https://github.com/vishwakamal/better-earth-today" target="_blank" rel="noopener noreferrer">Source Code</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
