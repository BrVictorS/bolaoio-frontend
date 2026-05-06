import api from "./api";
import { jwtDecode } from "jwt-decode";

export const authService = {
    login: async (email, senha) => {
        try {
            const response = await api.post('/auth/login', { email, senha });
            const { token, nome } = response.data; // Certifique-se que o backend retorna 'nome' também

            if (!token) {
                throw new Error("Token não retornado pela API");
            }

            localStorage.setItem("token", token);
            // Salva o nome se vier do back, senão tenta salvar 'Usuário'
            localStorage.setItem("nome", nome || "Usuário"); 

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    register: async (nome, email, senha) => {
        try {
            const response = await api.post('/auth/register', { nome, email, senha });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    // --- CORREÇÃO AQUI ---
    isAdmin: () => {
        const token = localStorage.getItem('token');
        
        // 1. Sem token? Não é admin.
        if (!token) return false;

        try {
            // 2. Tenta decodificar
            const decoded = jwtDecode(token);
            
            // 3. Verifica a role.
            // O .NET costuma usar essa URL longa para roles, por segurança verificamos as duas formas.
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;

            // 4. Retorna TRUE ou FALSE (quem chama a função decide o que fazer com isso)
            return role === 'admin' || role === 'Admin';
            
        } catch (error) {
            // Se o token estiver corrompido ou inválido
            return false;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem("token");
        // Dica extra: Aqui você poderia verificar se o token expirou usando jwtDecode também
        return !!token;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("nome");
        window.location.href = "/"; // Força o redirecionamento
    }
};