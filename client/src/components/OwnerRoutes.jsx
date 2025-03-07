import React from "react";
import { Navigate } from "react-router-dom";

function OwnerProtectedRoute({ children, userRole }) {
  // If the user is not role 0, redirect
  if (userRole !== 0) {
    return <Navigate to="/error" replace />;
  }
  return children;
}

export default OwnerProtectedRoute;