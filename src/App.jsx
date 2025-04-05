import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import DeedofSale from "./Pages/DeedofSale";
import Vehicles from "./Pages/Vehicles";
import "./Stylesheets/styles.css";
import carImage from "./Assets/car.png"; 
import logo from "./Assets/logo.png";
import ProtectedRoute from "./Components/ProtectedRoutes";

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
const app = initializeApp(firebaseConfig); //initialize using config
const auth = getAuth(app); //firebase authentication
const provider = new GoogleAuthProvider(); //google provider
const db = getFirestore(app); //nosql database 


function HomePage({user}) {
  return (
    <div className="container">
      <div className="left-content">
        <h2>Welcome to</h2>
        <h1>WHEELS & DEALS</h1>
        {user?.isAdmin && (
          <div className="buttons">
            <Link to="/deed-of-sale" className="btn">Deed of Sale</Link>
            <Link to="/vehicles" className="btn">Vehicles</Link>
          </div>
        )}
      </div>
      <div className="right-content">
        <img src={carImage} alt="Car" className="car-image" />
      </div>
    </div>
  );
}


// Main App component
// This component handles the routing and authentication logic of the application
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
      //Use firebase authentication to sign in with Google
      //Returns a promise that resolves with the result of the sign-in operation
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //User an admin?
      const adminRef = doc(db, "admins", user.email);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        console.log("User is an admin:", user.email);
        setUser({ ...user, isAdmin: true });
      } else {
        console.log("User is not an admin:", user.email);
        setUser({ ...user, isAdmin: false });
      }
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
        <Route path="/" element={<HomePage user={user}/>} />
        <Route path="/deed-of-sale" element={
          <ProtectedRoute user ={user} isAdminRequired={true}>
            <DeedofSale />
          </ProtectedRoute>
        } 
        />
        <Route path="/vehicles" element={
          <ProtectedRoute user ={user} isAdminRequired={true}>
            <Vehicles />
          </ProtectedRoute>
        } 
        />
      </Routes>
    </Router>
  );
}

export default App;
export { db };