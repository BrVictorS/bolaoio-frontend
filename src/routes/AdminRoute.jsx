import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

/**
 * Protege rotas exclusivas de administrador.
 * Redireciona para /dashboard se o usuário estiver autenticado mas não for admin.
 */
export function AdminRoute() {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    if (!authService.isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
