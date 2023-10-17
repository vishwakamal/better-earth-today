// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import CurrentNewsPage from './Pages/CurrentNewsPage';
import image1 from './Images/images1.jpeg';

function App() {

  return (
    <Router>
      <div className="container">
      
        <Header/>
        
        
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />  
            <Route path="/current-news" element={<CurrentNewsPage />} />
          </Routes>
        </div>
        
        <div className="images">
          <img src={image1}/>
        {/* Add more images as needed */}
        </div>
         
        <Footer/>
      </div>
    </Router>
  );

}




export default App;