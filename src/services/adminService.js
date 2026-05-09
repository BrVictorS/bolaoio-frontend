import api from "./api";

export const adminService = {
    listarUsuarios: async () => {
        const response = await api.get('/admin/listar-usuarios');
        return response.data;
    },
    alterarStatusUsuario: async (idUsuario, ativo) => {
        const response = await api.post('/admin/status-usuario', { idUsuario, ativo });
        return response.data;
    },
    listarPartidasDetalhes: async () => {
        const response = await api.get('/admin/partidas-detalhes');
        return response.data;
    },
    sincronizarPartidas: async () => {
        const response = await api.post('/admin/sincronizar-partidas');
        return response.data;
    },
    processarResultado: async (partidaId) => {
        const response = await api.post(`/admin/processar-resultado/${partidaId}`);
        return response.data;
    },
    alterarStatusPartida: async (idPartida, statusPartida) => {
        const response = await api.post('/admin/status-partida', { idPartida, statusPartida });
        return response.data;
    },
    criarPartida: async (idTimeA, idTimeB, dataPartida) => {
        const response = await api.post('/admin/criarPartida', { idTimeA, idTimeB, dataPartida });
        return response.data;
    },
    atualizarTimes: async () => {
        const response = await api.post('/admin/atualizarTimes');
        return response.data;
    },
    getLogs: async () => {
        const response = await api.get('/admin/log');
        return response.data;
    },
    getParticipantesBolao: async (bolaoId) => {
        const response = await api.get(`/bolao/${bolaoId}/participantes`);
        return response.data;
    },
    cancelarPalpite: async (palpiteId) => {
        const response = await api.post(`/bolao/palpite/${palpiteId}/cancelar`);
        return response.data;
    },
    getResultadoBolao: async (bolaoId) => {
        const response = await api.get(`/bolao/${bolaoId}/resultado`);
        return response.data;
    },
    getTimes: async () => {
        const response = await api.get('/bolao/times');
        return response.data;
    },
};
