import api from "./api";
import { jwtDecode } from "jwt-decode";
import {
    LoginRequestDto, mapLoginResponseDto,
    RegisterRequestDto, mapRegisterResponseDto,
    GoogleLoginRequestDto, mapGoogleLoginResponseDto,
    ForgotPasswordRequestDto, mapForgotPasswordResponseDto,
    ResetPasswordWithTokenRequestDto, mapResetPasswordWithTokenResponseDto,
    CompleteProfileRequestDto, mapCompleteProfileResponseDto
} from "../dtos/auth";

const persistSession = ({ token, nome, fotoUrl }) => {
    if (!token) throw new Error("Token não retornado pela API");
    localStorage.setItem("token", token);
    localStorage.setItem("nome", nome || "Usuário");
    if (fotoUrl) localStorage.setItem("fotoUrl", fotoUrl);
    else localStorage.removeItem("fotoUrl");
};

export const authService = {
    login: async (email, senha) => {
        try {
            const response = await api.post('/auth/login', LoginRequestDto(email, senha));
            const dto = mapLoginResponseDto(response.data);
            persistSession(dto);
            return dto;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    register: async (nome, email, senha, cpf) => {
        try {
            const response = await api.post('/auth/register', RegisterRequestDto(nome, email, senha, cpf));
            return mapRegisterResponseDto(response.data);
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    googleLogin: async (idToken) => {
        try {
            const response = await api.post('/auth/google', GoogleLoginRequestDto(idToken));
            const dto = mapGoogleLoginResponseDto(response.data);
            persistSession(dto);
            localStorage.setItem("requerComplementoCadastro", dto.requerComplementoCadastro ? "1" : "0");
            return dto;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao autenticar com Google' };
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', ForgotPasswordRequestDto(email));
            return mapForgotPasswordResponseDto(response.data);
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    resetPasswordWithToken: async (token, novaSenha) => {
        try {
            const response = await api.post('/auth/reset-password-token', ResetPasswordWithTokenRequestDto(token, novaSenha));
            return mapResetPasswordWithTokenResponseDto(response.data);
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    completeProfile: async (cpf) => {
        try {
            const response = await api.put('/usuario/me/complete-profile', CompleteProfileRequestDto(cpf));
            const dto = mapCompleteProfileResponseDto(response.data);
            localStorage.setItem("requerComplementoCadastro", "0");
            return dto;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    requerComplementoCadastro: () => localStorage.getItem("requerComplementoCadastro") === "1",

    isAdmin: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
            return role === 'admin' || role === 'Admin';
        } catch (error) {
            return false;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem("token");
        return !!token;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("nome");
        localStorage.removeItem("fotoUrl");
        localStorage.removeItem("requerComplementoCadastro");
        window.location.href = "/";
    }
};
