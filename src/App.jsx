import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './Pages/LandingPage.jsx';
import TrackerPage from './Pages/TrackerPage.jsx';
import NewsPage from './Pages/NewsPage.jsx';
import DashboardPage from './Pages/DashboardPage.jsx';

function App() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
