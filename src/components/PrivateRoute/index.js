import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.user);

    const isAuthenticated = token || sessionStorage.getItem('token');

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
