import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, isAdminRequired, children }) {
  // If no user is logged in or the user is not an admin (when required), redirect to the home page
  if (!user || (isAdminRequired && !user.isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
