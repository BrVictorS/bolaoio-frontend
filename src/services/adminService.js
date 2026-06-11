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
    reenviarPremio: async (palpiteId) => {
        const response = await api.post(`/admin/palpite/${palpiteId}/reenviar-premio`);
        return response.data;
    },
    finalizarPartida: async (partidaId, golsTimeA, golsTimeB) => {
        const response = await api.post(`/admin/partida/${partidaId}/finalizar`, { golsTimeA, golsTimeB });
        return response.data;
    },
    getPagamentosBolao: async (bolaoId) => {
        const response = await api.get(`/admin/bolao/${bolaoId}/pagamentos`);
        return response.data;
    },
    getBoloesPartida: async (partidaId) => {
        const response = await api.get(`/admin/partida/${partidaId}/bolaoes`);
        return response.data;
    },
    consultarResultado: async (partidaId) => {
        const response = await api.get(`/admin/partida/${partidaId}/resultado`);
        return response.data;
    },
    getFluxoCaixa: async () => {
        const response = await api.get("/admin/fluxo-caixa");
        return response.data;
    },
    listarTodosTicketsAdmin: async (pagina = 1) => {
        const response = await api.get(`/admin/tickets?pagina=${pagina}`);
        return response.data;
    },
    responderTicket: async (ticketId, resposta) => {
        const response = await api.post(`/admin/tickets/${ticketId}/responder`, { Resposta: resposta });
        return response.data;
    },
    fecharTicketAdmin: async (ticketId) => {
        const response = await api.post(`/admin/tickets/${ticketId}/fechar`);
        return response.data;
    },
    getLogs: async (tipo = null, pagina = 1) => {
        const params = new URLSearchParams({ pagina });
        if (tipo !== null && tipo !== undefined) params.append('tipo', tipo);
        const response = await api.get(`/admin/log?${params.toString()}`);
        return response.data;
    },
};
