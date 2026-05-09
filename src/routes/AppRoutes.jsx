import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home } from '../pages/home/Home.jsx';
import { Login } from '../pages/login/Login.jsx';
import { Register } from '../pages/login/Register.jsx'
import { AuthLayout } from '../pages/login/AuthLayout.jsx'
import { ForgotPassword } from '../pages/login/ForgotPassword.jsx';
import { ResetPassword } from '../pages/login/ResetPassword.jsx';
import { CompleteProfile } from '../pages/login/CompleteProfile.jsx';
import { Dashboard } from '../pages/dashboard/Dashboard.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PagesLayout } from '../pages/page-layout/PageLayout.jsx';
import { Bolao } from '../pages/bolao/Bolao.jsx';
import { BolaoConvite } from '../pages/bolao/BolaoConvite.jsx';
import { MeusBolaoes } from '../pages/meus-bolaoes/MeusBolaoes.jsx';
import { MeusPalpites } from '../pages/palpite/MeusPalpites.jsx';
import Palpite from '../pages/palpite/Palpite.jsx';
import { Admin } from '../pages/admin/Admin.jsx';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bolao/:id/convite" element={<BolaoConvite />} />

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route path="/complete-profile" element={<CompleteProfile />} />
                    </Route>
                    <Route element={<PagesLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/bolao" element={<Bolao />} />
                        <Route path="/meus-bolaoes" element={<MeusBolaoes />} />
                        <Route path="/palpite" element={<MeusPalpites />} />
                        <Route path="/palpite/:idBolao/palpite" element={<Palpite />} />
                        <Route path="/admin" element={<Admin />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
