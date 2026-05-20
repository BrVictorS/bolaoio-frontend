import api from "./api";

export const usuarioService = {
    getPerfil: async () => {
        try {
            const response = await api.get('/usuario/perfil');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },
    registrarChavePix: async (tipoChavePix, chavePix) => {
        const response = await api.put('/usuario/me/chave-pix', { tipoChavePix, chavePix });
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/usuario/me');
        return response.data;
    },
    alterarPerfil: async (nome, email) => {
        const response = await api.put('/usuario/me/perfil', { nome, email });
        return response.data;
    }
};
