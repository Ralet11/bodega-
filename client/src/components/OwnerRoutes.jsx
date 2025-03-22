// OwnerProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function OwnerProtectedRoute({ children, userRole, token }) {
  // 1) Si no hay token => Redirige al "/"
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // 2) Si hay token, pero el rol NO es 0 => Redirige a "/error"
  if (userRole !== 0) {
    return <Navigate to="/error" replace />;
  }

  // 3) Todo bien => Renderiza el componente hijo
  return children;
}

export default OwnerProtectedRoute;
