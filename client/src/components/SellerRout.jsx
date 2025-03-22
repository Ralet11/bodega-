// SellerProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function SellerProtectedRoute({ children, userRole, token }) {
  // 1) Si no hay token => Redirige al "/"
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2) Si hay token, pero el rol NO es 1 => Redirige a "/error"
  if (userRole !== 1) {
    return <Navigate to="/error" replace />;
  }

  // 3) Todo bien => Renderiza el componente hijo
  return children;
}

export default SellerProtectedRoute;
