import React from 'react'
import { Navigate } from 'react-router-dom'

function SellerProtectedRoute({ children, userRole }) {
  // If the user is not role 1, redirect them to an error page or anywhere you prefer
  if (userRole !== 1) {
    return <Navigate to="/error" replace />
  }

  // Otherwise, allow access
  return children
}

export default SellerProtectedRoute