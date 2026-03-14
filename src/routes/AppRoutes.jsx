import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home } from '../pages/home/Home.jsx';
import { Login } from '../pages/login/Login.jsx';
import { Register } from '../pages/login/Register.jsx'
import { AuthLayout } from '../pages/login/AuthLayout.jsx'
import { Dashboard } from '../pages/dashboard/Dashboard.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { Wallet } from '../pages/wallet/Wallet.jsx';
import { PagesLayout } from '../pages/page-layout/PageLayout.jsx';
import { Bolao } from '../pages/bolao/Bolao.jsx';
import { MeusPalpites } from '../pages/palpite/MeusPalpites.jsx';
import Palpite from '../pages/palpite/Palpite.jsx';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<PagesLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/carteira" element={<Wallet />} />
                        <Route path="/bolao" element={<Bolao />} />
                        <Route path="/palpite" element={<MeusPalpites />} />
                        <Route path="/palpite/:idBolao/palpite" element={<Palpite />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    ); 
}
