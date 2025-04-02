import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DeedofSale from "./Pages/DeedofSale";
import Vehicles from "./Pages/Vehicles";
import "./Stylesheets/styles.css";
import carImage from "./Assets/car.png"; 
import logo from "./Assets/logo.png";

function App() {
  return (
    <Router>
        <div className="container">
           <header className="header">
          <Link to="/">
            <img src={logo} alt="Wheels & Deals Logo" className="logo-img" />
          </Link>
        </header>
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

        <Routes>
          <Route path="/deed-of-sale" element={<DeedofSale />} />
          <Route path="/vehicles" element={<Vehicles />} />
        </Routes>
    </Router>
  );
}

export default App;
