import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => {
    return sessionStorage.getItem('token');
};

const PrivateRoute = ({ children }) => {
    const location = useLocation();

    return isAuthenticated() ? children : <Navigate to="/" state={{ from: location }} replace />;
};

export default PrivateRoute;
