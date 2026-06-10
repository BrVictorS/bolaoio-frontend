import api from "./api";

export const ticketService = {
    criarTicket: async (titulo, descricao) => {
        const response = await api.post('/tickets', { Titulo: titulo, Descricao: descricao });
        return response.data;
    },

    listarMeusTickets: async () => {
        const response = await api.get('/tickets/meus');
        return response.data;
    },

    fecharTicket: async (ticketId) => {
        const response = await api.post(`/tickets/${ticketId}/fechar`);
        return response.data;
    },

    reabrirTicket: async (ticketId) => {
        const response = await api.post(`/tickets/${ticketId}/reabrir`);
        return response.data;
    },

    // Admin
    listarTodosTickets: async (pagina = 1) => {
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
};
