import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export function ProtectedRoute() {
    const location = useLocation();

    if (!authService.isAuthenticated()) {
        authService.logout();
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return <Outlet />;
}
