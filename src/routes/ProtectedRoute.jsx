import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute() {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return <Outlet />;
}
