import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { memo } from 'react';

const ProtectedRoute = memo(({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
});

export default ProtectedRoute;