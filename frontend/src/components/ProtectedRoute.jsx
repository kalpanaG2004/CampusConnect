import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Please login first.");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
