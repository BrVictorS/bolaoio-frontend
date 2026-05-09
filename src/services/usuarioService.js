import api from "./api";

export const usuarioService = {
    obterChavePix: async () => {
        const response = await api.get('/usuario/chave-pix');
        return response.data;
    },
    definirChavePix: async (chavePix) => {
        const response = await api.put('/usuario/chave-pix', { chavePix });
        return response.data;
    },
};
