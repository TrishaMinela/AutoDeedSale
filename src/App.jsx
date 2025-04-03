import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import DeedofSale from "./Pages/DeedofSale";
import Vehicles from "./Pages/Vehicles";
import "./Stylesheets/styles.css";
import carImage from "./Assets/car.png"; 
import logo from "./Assets/logo.png";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


function HomePage() {
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

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Google login
  const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info will be available in result.user
    console.log(result.user);
    setUser(result.user); 
  } catch (error) {
    console.error(error);
  }
};
  // Logout
  const handleLogout = () => {
  signOut(auth).then(() => {
    console.log("User logged out");
    setUser(null);
  }).catch((error) => {
    console.error(error);
  });
};

  return (
    <Router>
      <header className="header">
          <Link to="/">
            <img src={logo} alt="Wheels & Deals Logo" className="logo-img" />
          </Link>
          <div className="auth-text">
            {user ? (
              <>
                <span className="welcome-text">Hi, {user.displayName}</span>
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
