import api from "./api";

export const bolaoService = {
    createBolao: async (bolaoData) => {
        const response = await api.post('/bolao/registrar_bolao', bolaoData);
        return response.data;
    },
    getAllBoloes: async () => {
        const response = await api.get('/bolao/listar');
        return response.data;
    },
    getBolaoById: async (id) => {
        const response = await api.get('/bolao/', { params: { id } });
        return response.data;
    },
    getMeusBolaoes: async () => {
        const response = await api.get('/bolao/meus-bolaoes');
        return response.data;
    },
    alterarVisibilidade: async (bolaoId, visibilidade) => {
        await api.patch(`/bolao/${bolaoId}/visibilidade`, { visibilidade });
    },
    getBolaoPublico: async (bolaoId) => {
        const response = await api.get(`/bolao/${bolaoId}/publico`);
        return response.data;
    },
    getParticipantes: async (bolaoId) => {
        const response = await api.get(`/bolao/${bolaoId}/participantes`);
        return response.data;
    },
    cancelarPalpite: async (palpiteId) => {
        const response = await api.post(`/bolao/palpite/${palpiteId}/cancelar`);
        return response.data;
    },
};
