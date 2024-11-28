import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => {
    return localStorage.getItem('token');
};

const PrivateRoute = ({ children }) => {
    const location = useLocation();

    return isAuthenticated() ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
