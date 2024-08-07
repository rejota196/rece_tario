import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { state: { isAuthenticated } } = useAuth();

  return isAuthenticated ? element : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
