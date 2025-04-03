import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DeedofSale from "./Pages/DeedofSale";
import Vehicles from "./Pages/Vehicles";
import "./Stylesheets/styles.css";
import carImage from "./Assets/car.png"; 
import logo from "./Assets/logo.png";

function HomePage({ user, handleLogin, handleLogout}) {
  return (
    <div className="container">
      <div className="left-content">
        <h2>Welcome to</h2>
        <h1>WHEELS & DEALS</h1>
        <div className="buttons">
          <Link to="/deed-of-sale" className="btn">Deed of Sale</Link>
          <Link to="/vehicles" className="btn">Vehicles</Link>
        </div>
      </div>
      <div className="right-content">
        <img src={carImage} alt="Car" className="car-image" />
      </div>
    </div>
  );
}

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }
  , []);  

  const handleLogin = () => {
    const userData = { name: "Admin", email: "admin@example.com" }; 
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); 
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); 
  }

  return (
    <Router>
      <header className="header">
          <Link to="/">
            <img src={logo} alt="Wheels & Deals Logo" className="logo-img" />
          </Link>
          <div className="auth-text">
            {user ? (
              <>
                <span className="welcome-text">Hi, {user.name}</span>
                <span className="auth-link" onClick={handleLogout}>Logout</span>
              </>
            ) : (
              <span className="auth-link" onClick={handleLogin}>Login</span>
            )}
          </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/deed-of-sale" element={<DeedofSale />} />
        <Route path="/vehicles" element={<Vehicles />} />
      </Routes>
    </Router>
  );
}

export default App;
